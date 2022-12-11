module.exports.getDate = function()
{
    const today = new Date();
    const options={
        month:'long',
        day:'numeric',
        weekday: 'long'
    };
    return   today.toLocaleDateString("en-us",options);
};