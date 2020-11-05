const $ = window.$

function fetchProducts () {
  $('#products-table tbody tr').remove()
  $.get('http://cafe-api.corentin.codes/products', function (data) {
    $.each(data, function (index, item) {
      const productImage = $($.parseHTML(`<figure>
      <img class="smartphone-image img-edit"
        src="${item.image}" alt="">
      </figure>`))
      $(`<tr product-id="${item.id}">`).append(
        $('<td class="brand-edit">').text(item.brand),
        $('<td class="model-edit">').text(item.model),
        $('<td class="os-edit">').text(item.os),
        $('<td class="screensize-edit">').html(`<span class="screensize-value">${item.screensize}</span>" (<abbr>inches</abbr>)`),
        $('<td>').html(productImage),
        $('<td class="actions">').html('<button type="button" class="edit-action action"><i class="icon solid fa-edit" /></button><button class="action delete-action" type="button"><i class="icon solid fa-trash-alt" /></button>')
      ).prependTo('#products-table')
    })
  }, 'json')
  $('#table-form').find('*').prop('disabled', false)
}

function createProduct (data) {
  $.post('http://cafe-api.corentin.codes/products', data)
    .done(function () {
      fetchProducts()
    })
    .fail(function (xhr, status, error) {
      alert(`An error occured : "${error}".`)
    })
}

$(document).ready(function () {
  fetchProducts()

  $('<input type="reset" value="Reset database" id="reset"/>').appendTo($('#best-selling'))

  $('#reset').on('click', function () {
    $.get('http://cafe-api.corentin.codes/products/reset')
      .done(function () {
        fetchProducts()
      })
      .fail(function (xhr, status, error) {
        alert(`An error occured : "${error}".`)
      })
  })

  $('#product-form').on('submit', function (e) {
    e.preventDefault()
    const data = {}
    $.each($(this).serializeArray(), function (i, field) {
      data[field.name] = field.value
    })
    createProduct(data)
  })

  $(document).on('click', '.delete-action', function () {
    const parent = $(this).parent().parent()
    $.ajax({
      url: `http://cafe-api.corentin.codes/products/${parent.attr('product-id')}`,
      method: 'DELETE'
    })
      .done(function () {
        parent.remove()
      })
      .fail(function (xhr, status, error) {
        alert(`An error occured : "${error}".`)
      })
  })

  $(document).on('click', '.edit-action', function () {
    const parent = $(this).parent().parent()
    const productId = parent.attr('product-id')

    $('#table-form').find('*').prop('disabled', true)

    $(parent).parent().find('tr').each(function () {
      const row = $(this)
      if (row.attr('product-id') !== productId) {
        row.find('.actions').find('button').prop('disabled', true)
      }
    })

    const brand = parent.find('.brand-edit')
    brand.html(`<input name="brand" type="string" value="${$(brand).html()}" />`)

    const model = parent.find('.model-edit')
    model.html(`<input name="model" type="string" value="${$(model).html()}" />`)

    const os = parent.find('.os-edit')
    os.html(`<input name="os" type="string" value="${$(os).html()}" />`)

    const screensize = parent.find('.screensize-value')
    screensize.html(`<input name="screensize" type="number" value="${$(screensize).html()}" />`)

    const image = parent.find('.img-edit:first-child')
    image.parent().html(`<input value="${$(image).attr('src')}" type="url" name="image" />`)

    parent.find('.actions').html(`<button type="button" class="save-action action" product-id="${productId}"><i class="icon solid fa-check" /></button>`)
  })

  $(document).on('click', '.save-action', function () {
    const parent = $(this).parent().parent()
    const productId = parent.attr('product-id')

    const data = {}
    parent.find('input').each(function () {
      data[$(this).attr('name')] = $(this).val()
    })

    $.ajax({
      type: 'PUT',
      url: `http://cafe-api.corentin.codes/products/${productId}`,
      data: JSON.stringify(data),
      contentType: 'application/json'
    }).done(function (data) {
      fetchProducts()
    }).fail(function (error) {
      console.log(error)
    })
  })

  $('.sorting-item')
    .each(function () {
      var th = $(this)
      var thIndex = th.index()
      var inverse = false

      th.click(function () {
        $(this).text($(this).html().indexOf('▼') > -1 ? $(this).html().replace('▼', '▲') : $(this).html().replace('▲', '▼'))
        $('#products-table').find('tbody').find('td').filter(function () {
          return $(this).index() === thIndex
        }).sortElements(function (a, b) {
          return $.text([a]) > $.text([b])
            ? inverse ? -1 : 1
            : inverse ? 1 : -1
        }, function () {
          return this.parentNode
        })
        inverse = !inverse
      })
    })
})

/* Assignement 4 Improvements */
window.onscroll = function () {
  var scroll = window.scrollX
  // i then modified the css by changing to 'top'
  $('#second').css('margin-top', '-' + scroll + 'px')
}
