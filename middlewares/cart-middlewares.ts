
export const verifyCart =  async (cart: any) =>{
    let i;
    cart = cart + "";
    const sum = [];
    let fsum = 0;
    for (i=0;i<cart.length-1;i+=2) {
        sum.push(parseInt(cart.substr(i,1))*2);
    }
    for (i=1;i<cart.length;i+=2) {
        fsum += parseInt(cart.substr(i,1));
    }
    for (i=0;i<sum.length;i++) {
        
        if (sum[i] > 9) {
            fsum += (sum[i]-(Math.floor(sum[i]/10)*10))+Math.floor(sum[i]/10);
        } else {
            fsum += sum[i];
        }
    }
    return fsum%10 == 0?true:false;
}
       