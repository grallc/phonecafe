const $ = window.$

function getOsSelect (elementId) {
  return `    
  <select name="os" form="product-form" required size="1" id="${elementId}">
    <option value="">Select OS</option>
    <option value="iOS 13">iOS 13</option>
    <option value="iOS 12">iOS 12</option>
    <option value="iOS 11">iOS 11</option>
    <option value="iOS 9">iOS 9</option>
    <option value="iOS 8">iOS 8</option>
    <option value="iOS 7">iOS 7</option>
    <option value="Android 10.0">Android 10.0</option>
    <option value="Android 9.0">Android 9.0</option>
    <option value="Android 8.0">Android 8.0</option>
    <option value="Android 7.0">Android 7.0</option>
    <option value="Android 6.0">Android 6.0</option>
    <option value="Android 5.0">Android 5.0</option>
  </select>`
}

function fetchProducts () {
  $('#products-table tbody tr').remove()
  $.get('http://localhost:3000/products', function (data) {
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
}

$(document).ready(function () {
  fetchProducts()

  $('#create-os-input').html(getOsSelect('create-os-input-element'))

  // Add the label for range slider.
  $(document).on('input', '.screensize-range', function () {
    console.log('truc')
    $(`#screensize-range-value-${$(this).attr('product-id')}`).html($(this).val() + '"')
  })

  $(document).on('click', '.delete-action', function () {
    const parent = $(this).parent().parent()
    $.ajax({ url: `/products/${parent.attr('product-id')}`, method: 'DELETE' })
      .then(function (data) {
        parent.remove()
      })
      .catch(function (err) {
        console.log(err)
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
    brand.html(`<input name="brand" value="${$(brand).html()}" />`)

    const model = parent.find('.model-edit')
    model.html(`<input name="model" value="${$(model).html()}" />`)

    const os = parent.find('.os-edit')
    const osValue = os.html()
    os.html(getOsSelect(`os-input-${productId}`))
    $(`#os-input-${productId}`).val(osValue)

    const image = parent.find('.img-edit:first-child')
    image.parent().html(`<input value="${$(image).attr('src')}" name="image" />`)

    const screensize = parent.find('.screensize-value:first-child')
    const range = $($.parseHTML(
      `<input type="range" name="screensize" min="3" max="8" class="screensize-range" product-id="${productId}" value="5">
      <span id="screensize-range-value-${productId}" product-id="${productId}">${screensize.html()}"</span>`))
    parent.find('.screensize-edit').html(range)

    parent.find('.actions').html(`<button type="button" class="save-action action" product-id="${productId}"><i class="icon solid fa-check" /></button>`)
  })

  $(document).on('click', '.save-action', function () {
    const parent = $(this).parent().parent()
    const productId = parent.attr('product-id')

    const data = {}
    parent.find('input').each(function () {
      data[$(this).attr('name')] = $(this).val()
    })
    data.os = parent.find(`#os-input-${productId}`).val()

    $.ajax({
      type: 'PUT',
      url: `http://localhost:3000/products/${productId}`,
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