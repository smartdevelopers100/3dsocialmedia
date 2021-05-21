
export function formatDate(date)
{
    let _date = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if(_date < 10)
    {
        _date  = `0${_date}`;
    }

    if(month < 10)
    {
        month = `0${month}`;
    }

    year = year.toString();
    year = year.substring(year.length-3);
    return `${_date}/${month}/${year}`;
}

export function formatAMPM(date)
{
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours < 12 ? 'am': 'pm';
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours % 12;
    hours = hours ? hours: 12;
    return `${hours}:${minutes} ${ampm}`;
}

export function formatTime(date)
{
    const today = new Date(); 
    const yearsDiff = today.getFullYear() - date.getFullYear();
    const monthsDiff = today.getMonth() - date.getMonth();
    const daysDiff = today.getDate() - date.getDate();
    const hoursDiff = today.getHours() - date.getHours();
    const minutesDiff = today.getMinutes() - date.getMinutes(); 

    if(yearsDiff > 0)
    {
        return `${yearsDiff} years ago`        
    }

    if(monthsDiff > 0)
    {
        return `${monthsDiff} months ago`
    }

    if(daysDiff > 0)
    {
        return `${daysDiff} days ago`;
    }

    if(hoursDiff > 0)
    {
        return `${hoursDiff} hours ago`;
    }

    if(minutesDiff > 0)
    {
        return `${minutesDiff} minutes ago`
    }

    return formatAMPM(date);
}