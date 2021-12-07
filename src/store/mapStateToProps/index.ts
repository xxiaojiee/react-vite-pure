// 例子：
export const getInputValueState1 = function (state) {
    return {
        value: state.currentValue,
    };
};
export const getInputValueState2 = function (state) {
    return {
        value: state.maxValue,
    };
};
