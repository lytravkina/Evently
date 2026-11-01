export function useFormattedDate(string) {
    let [date, time] = string.split("T");

    const [year, month, day] = date.split("-");

    const [hour, minute] = time.split(":");

    const formattedDate = `${day}.${month}.${year} ${hour}:${minute}`;

    return formattedDate;
}