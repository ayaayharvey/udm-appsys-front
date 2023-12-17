export function formatDate(inputDate: string): string {
    const date = new Date(inputDate);

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);
    
    return formattedDate;
}
