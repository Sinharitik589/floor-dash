export const changeFormat = (val, type) => {

    if (val > 0) {
        let date = new Date(val);
        let input_format = `${date.getFullYear()}-${(date.getMonth() < 10) ? `0${date.getMonth()}` : date.getMonth()}-${(date.getDate() < 10) ? `0${date.getDate()}` : date.getDate()}`;
        let output_format = `${(date.getDate() < 10) ? `0${date.getDate()}` : date.getDate()}-${(date.getMonth() < 9) ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getFullYear()}`;
        return (type == "output") ? output_format : input_format;
    }
    return "";
}

export const reverseDate = (val, type) => {
    let date_array = val.split("-");
    if (date_array.length > 0) {
        if ((date_array[0].length == 4 && type == "input") || (date_array[2].length == 4 && type == "output")) {
            return val
        }
        else {
            let month = (type == "output") ? parseInt(date_array[1]) : parseInt(date_array[1]);
            let value = `${date_array[2]}-${(month < 10) ? `0${month}` : month}-${date_array[0]}`;
            return value;
        }
    }
    return "";
}

export const compareDate = (first, second) => {

    if (first == "" || second == '')
        return null;
    else if (first == second) {
        return true
    }
    else {
        let first_array = first.split("-");
        let second_array = second.split("-")
        let first_year = parseInt(first_array[0]);
        let first_month = parseInt(first_array[1]);
        let first_day = parseInt(first_array[2]);
        let second_year = parseInt(second_array[0]);
        let second_month = parseInt(second_array[1]);
        let second_day = parseInt(second_array[2]);
        if (first_year == second_year) {
            if (first_month == second_month) {
                return first_day > second_day
            }
            else return first_month > second_month
        }
        else return (first_year > second_year)
    }
}

export const accessToken = "eyJ0eXAiOiJKV1QiLCJub25jZSI6Ik1hUmlXZ1VZSFBkRHlLYmZjTC04OTE1M0J0VWJ0R1dKWFZhQW93NFNnMXciLCJhbGciliJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jM2RlYmNjZi0wZjY0LTRmYzktODY4Ni1lZGVlZGJlOWY1MTMvIiwiaWF0IjoxNjI2MjgwNzc3LCJuYmYiOjE2MjYyODA3NzcsImV4cCI6MTYyNjI4NDY3NywiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMkiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiQVNRQTIvOFRBQUFBK2E1MTFQUEs0b0hkaXJHNFQ4aFpRUy9mWDhQTnFBaUYraDRDVnoyT1ZjZz0iLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkR5bmFtaWNQcmljaW5nVUktREVWIiwiYXBwaWQiOiJlMzdmNjJmMy1hYzViLTRmM2UtOWM5Zi04NmMwZTg1MGE3ZWQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkFiZWNhc3NpcyIsImdpdmVuX25hbWUiOiJNb3JhbiIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjIwLjczLjIwOS4zNCIsIm5hbWUiOiJBYmVjYXNzaXMgTW9yYW4iLCJvaWQiOiIzMTlhY2NmYS0zMTYyLTRmZGEtYjZmYS0wZTE3YjM3NWNkOTMiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMTUwODA0OTMxMS01MzYyOTc5NjktODUzNDE0ODA3LTY4MDY0IiwicGxhdGYiOiIxNCIsInB1aWQiOiIxMDAzMjAwMDQ2NDEwNUQ4IiwicmgiOiIwLkFYTUF6N3pldzJRUHlVLUdodTN1Mi1uMUVfTmlmLU5ickQ1UG5KLUd3T2hRcC0xekFLby4iLCJzY3AiOiJVc2VyLlJlYWQgcHJvZmlsZSBvcGVuaWQgZW1haWwLCJzaWduaW5fc3RhdGUiOlsiaW5rbm93bm50d2siXSwic3ViIjoidWxzNzlBQkNyN092ZVhCT29DamNBRDhzWkFOc0NNRzRYSzB4N1FyZnpLcyIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6ImMzZGViY2NmLTBmNjQtNGZjOS04Njg2LWVkZWVkYmU5ZjUxMyIsInVuaXF1ZV9uYW1lIjoiZXhfYWJlY2Fzc2lzLm1vcmFuQGNvcnAuemltLmNvbSIsInVwbiI6ImV4X2FiZWNhc3Npcy5tb3JhbkBjb3JwLnppbS5jb20iLCJ1dGkiOiJhNGlrdktTb1cwZVM0TF9lYkJYSkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6InNhU25qX01GQ3RHNWxmWS1WT25NeE4ta2FHbmxiamFIMXk3S2xkV3JUVk0ifSwieG1zX3RjZHQiOjE0Njc3MTkzNjF9.Y6KNhbB8u7ei4PD2djh5dJdQVSART5ahPHNVzly907S-MQcmnYV6Lhd0qZ5P8X9_R8qnk1fOC-WltEBt6hcgC7oFjjEHmLR7sVlzPJw5iY2_s6mHax6KoyQO9Pl-6gvIYHiGuOAl5mgxh9m3QQit_PkU164ShJNYYdOf9502RaaPirsdfFZmUpGav6-RSFkRLntQv68DLTedrOEsuWP_UEnnup5iv39B5GVw6axy__PXj7duduSLk38-Q7reDTnqd21QPeoiBd16XtzVLzbV02X40L-rb03mWwvhtxIu3znbpD23rBwFWd4DDuuQsYDAUjxHMBZJjNDJPuYhw"