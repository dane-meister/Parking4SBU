const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

export default function formatMoney(money){
    let str = `${money}`; // incase not string already

    const formatted = formatter.format(str);
    return formatted.substring(1)   
}