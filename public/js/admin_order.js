// get user
async function getUser() {
    try {
        const response = await fetch('/userInfo');
        if (response.ok) {
            const data = await response.json();
            document.querySelector('#username').textContent = data.username;
        }
        else if (response.status == 500) {
            const data = await response.text();
            throw Error(data);
        }
        else {
            throw Error('Connection error');
        }
    } catch (err) {
        console.error(err.message);
        Notiflix.Report.failure('Error', err.message, 'Close');
    }
}

// get order list from database
async function getOrder() {
    try {
        const response = await fetch('/admin/order');
        if (response.ok) {
            const data = await response.json();
            showOrder(data);
        }
        else if (response.status == 500) {
            const data = await response.text();
            throw Error(data);
        }
        else {
            throw Error('Connection error');
        }
    } catch (err) {
        console.error(err.message);
        Notiflix.Report.failure('Error', err.message, 'Close');
    }
}

// show product table
function showOrder(data) {
    const tbody = document.querySelector('#tbody');
    let temp = '';
    data.forEach(function(order) {
        temp += `<tr>`;
        temp += `<td>${order.ordering_id}</td>`;
        temp += `<td>${new Date(order.date).toLocaleDateString()}</td>`;
        temp += `<td>${order.username}</td>`;
        if(order.status == 1) {
            temp += `<td class="text-warning">Pending</td>`;
        }
        else {
            temp += `<td class="text-success">Complete</td>`;
        }
        // note that we can send only number or String with '' as function's parameters
        temp += `<td><button class="btn btn-success" onclick=getDetail(${order.ordering_id})>View</button></td>`;
        temp += `</tr>`;
    });
    tbody.innerHTML = temp;
}

// get order detail from database
async function getDetail(ordering_id) {
    Notiflix.Block.standard('.block');
    try {
        const response = await fetch(`/user/order/${ordering_id}`);
        if (response.ok) {
            Notiflix.Block.remove('.block', 200);
            const data = await response.json();
            showDetail(data, ordering_id);
        }
        else if (response.status == 500) {
            const data = await response.text();
            throw Error(data);
        }
        else {
            throw Error('Connection error');
        }
    } catch (err) {
        console.error(err.message);
        Notiflix.Report.failure('Error', err.message, 'Close');
    }
}

// show order details
function showDetail(data, ordering_id) {
    const tableDetail = document.querySelector('#tableDetail');
    let temp = '<thead><tr><th>Product ID</th> <th>Name</th> <th>Price</th></tr></thead>';
    temp += '<tbody>';
    data.forEach(function(product) {
        temp += `<tr>`;
        temp += `<td>${product.product_id}</td>`;
        temp += `<td>${product.name}</td>`;
        temp += `<td>${product.price}</td>`;
        temp += `</tr>`;
    });
    temp += `<tr><td><button class="btn btn-primary" onclick=confirm(${ordering_id})>Confirm</button></td></tr>`;
    temp += '</tbody>';
    tableDetail.innerHTML = temp;
}

// confirm change product status
function confirm(ordering_id) {
    Notiflix.Confirm.show('Confirm', 'Confirm this order?', 'Yes', 'No', 
        async function okCb() {
            try {
                const response = await fetch(`/admin/order/${ordering_id}`, {method: 'PUT'});
                if (response.ok) {
                    const data = await response.text();
                    Notiflix.Report.success('Success', data, 'OK', 
                        function cb() {
                            // reload page
                            getOrder();
                        }
                    );
                }
                else if (response.status == 500) {
                    const data = await response.text();
                    throw Error(data);
                }
                else {
                    throw Error('Connection error');
                }
            } catch (err) {
                console.error(err.message);
                Notiflix.Report.failure('Error', err.message, 'Close');
            }
        }
    );
}

// get user info
getUser();
// get and show all orders
getOrder();