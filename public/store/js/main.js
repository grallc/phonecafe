const $ = window.$
$(document).ready(function () {
  $.get('http://localhost:3000/products', function (data) {
    $.each(data, function (index, item) {
      const productImage = $($.parseHTML(`<figure>
      <img class="smartphone-image"
        src="${item.image}" alt="">
      </figure>`))
      $(`<tr product-id="${item.id}">`).append(
        $('<td>').text(item.brand),
        $('<td>').text(item.model),
        $('<td>').text(item.os),
        $('<td>').html(`${item.screensize}" (<abbr>inches</abbr>)`),
        $('<td>').html(productImage),
        $('<td>').html('<button type="button" class="action"><i class="icon solid fa-edit" /></button><button class="action delete-action" type="button"><i class="icon solid fa-trash-alt" /></button>')
      ).prependTo('#products-table')
    })
  }, 'json')

  // Add the label for range slider.
  $(document).on('input', '#screensize-range', function () {
    $('#screensize-range-value').html($(this).val() + '"')
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