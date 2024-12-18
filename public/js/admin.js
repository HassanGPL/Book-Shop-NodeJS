const deleteProduct = (btn) => {
    const productId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const parentElement = btn.closest('article');

    fetch('/admin/product/' + productId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            parentElement.remove();
        })
        .catch(err => {
            console.log(err)
        })
}