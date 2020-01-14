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
        $('<td>').html('<button class="action"><i class="icon solid fa-edit" /></button><button class="action"><i class="icon solid fa-trash-alt" /></button>')
      ).prependTo('#products-table')
    })
  }, 'json')

  // Add the label for range slider.
  $('#screensize-range').on('input', function () {
    $('#screensize-range-value').html($(this).val() + '"')
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