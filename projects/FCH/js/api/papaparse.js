export function parseCSV(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: results => resolve(results.data),
            error: reject
        });
    });
}

export function parseTXT(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: results => resolve(results.data),
            error: reject
        });
    });
}

export function parseMoxfield(file) {
    return new Promise((resove, reject) => {
        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: results => resolve(results.data),
            error: reject
        })
    })
}