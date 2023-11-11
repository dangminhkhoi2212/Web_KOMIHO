export const getToDay = () => {
    var today = new Date();
    return today.toISOString();
};
export const convertISO = (ISOTime) => {
    const timestamp = new Date(ISOTime);
    const convertedDate = timestamp.toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return `${convertedDate.split(', ')[1]}, ${convertedDate.split(', ')[0]}`;
};
export const ISOTimeToTime = (ISOTime) => {
    var timestamp = convertISO(ISOTime);
    return timestamp.split(', ')[0];
};
export const ISOTimeToDate = (ISOTime) => {
    var timestamp = convertISO(ISOTime);
    return timestamp.split(', ')[1];
};
