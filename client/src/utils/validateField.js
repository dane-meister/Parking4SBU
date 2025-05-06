export function isNonNullAndEmpty(state){
    return state !== null && state === '';
}
  
export function isNullOrHasMoneyPrecision(state){
    if(state === null) return true;

    if(state.match(/^\d*[.]\d{3,}$/)){ // too many digits for money
        return false;
    }
    
    return true;
}