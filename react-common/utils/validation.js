'use strict'

const regs = {
    number: /^\d+$/,
    money: /^\d+(\.\d{1,2})?$/,
}

export const checkValid = function(type, str) {
    return regs[type].test(str);
}