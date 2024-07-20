import linkedList from "./dependencies.js";

let array = [];
let arrayBubbleTime=0;
let listBubbleTime=0;
let arrayMergeTime=0;
let listMergeTime=0;
let arrayRadixTime=0;
let listRadixTime=0;

document.getElementById('loadArray').addEventListener('click', async function() {
    fetch("./bussines.json")
        .then((response) => response.json())
        .then((data) => {
            insertData(data);
        })
        .catch((err) => console.log(err));
});

function insertData(data) {
    const arrayPromise = new Promise((resolve) => {
        const start = performance.now();
        addToArray(data);
        const end = performance.now();
        const timeTaken = ((end - start) / 1000).toFixed(4);
        console.log('Array insertion time:', timeTaken);
        resolve(timeTaken);
    });

    const listPromise = new Promise((resolve) => {
        const start = performance.now();
        addToList(data);
        const end = performance.now();
        const timeTaken = ((end - start) / 1000).toFixed(4);
        console.log('List insertion time:', timeTaken);
        resolve(timeTaken);
    });

    Promise.all([arrayPromise, listPromise]).then((times) => {
        const [arrayTime, listTime] = times;
        document.getElementById('sortTime').textContent = `Tiempo de ordenamiento del array: ${arrayTime} segundos`;
        document.getElementById('sortTimeList').textContent = `Tiempo de ordenamiento de la LinkedList: ${listTime} segundos`;
        generarGrafica(arrayTime, listTime);
    });
}

function addToArray(data) {
    for (let x = 0; x < 150347; x++) {
        if (data[x]) {
            array.push(data[x]);
        }
    }
    document.getElementById('bubbleSortArray').disabled = false;
}

function addToList(data) {
    for (let x = 0; x < 150347; x++) {
        if (data[x]) {
            linkedList.add(data[x]);
        }
    }
    document.getElementById('sortListMerge').disabled = false;
    document.getElementById('mergeSortArray').disabled = false;
    document.getElementById('compareMergeTimes').disabled = false;
    document.getElementById('sortListBubble').disabled = false;
    document.getElementById('sortListRadix').disabled = false;
    document.getElementById('compareBubbleTimes').disabled = false;
    document.getElementById('radixSortArray').disabled = false;
    document.getElementById('compareRadixTimes').disabled = false;
    document.getElementById('searchList').disabled = false;
    document.getElementById('searchArray').disabled = false;
}

function generarGrafica(arrayTime, listTime) {
    const ctx = document.getElementById('myChartAdd').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Array', 'LinkedList'],
            datasets: [{
                label: 'Insertion Time (seconds)',
                data: [arrayTime, listTime],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function bubbleSort(array) {
    let swapped;
    let n = array.length;
    let iterations = 0;
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            iterations++;
            if (array[i].review_count > array[i + 1].review_count) {
                let temp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = temp;
                swapped = true;
            }
        }
        n--;
    } while (swapped);
    return iterations;
}

document.getElementById('bubbleSortArray').addEventListener('click', function(){
    const startTime = performance.now();
    const iterations = bubbleSort(array);
    const endTime = performance.now();
    const arrayBubbleTime = (endTime - startTime) / 1000;
    document.getElementById('arrayBubbleTime').textContent = `Tiempo de ordenamiento del array: ${arrayBubbleTime.toFixed(4)} segundos, Iteraciones: ${iterations}`;
});

document.getElementById('sortListBubble').addEventListener('click', function(){
    const startTime = performance.now();
    linkedList.bubbleSort(); 
    const iterations = linkedList.bubbleSort();
    const endTime = performance.now();
    listBubbleTime = (endTime - startTime) / 1000; 
    document.getElementById('sortTimeListBubble').textContent = `Tiempo de ordenamiento de la lista enlazada (Bubble Sort): ${listBubbleTime.toFixed(4)} ms, Iteraciones: ${iterations}`;
});

document.getElementById('compareBubbleTimes').addEventListener('click', function(){
    if (arrayBubbleTime > 0 && listBubbleTime > 0) {
        generarGraficaBubble(arrayBubbleTime, listBubbleTime);
    } else {
        alert('Debe ordenar ambos conjuntos de datos antes de comparar.');
    }
});

function generarGraficaBubble(arrayBubbleTime, listBubbleTime) {
    const ctx = document.getElementById('myChartBubble').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Array', 'LinkedList'],
            datasets: [{
                label: 'Tiempo de Ordenamiento (segundos)',
                data: [arrayBubbleTime, listBubbleTime],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

let mergeSortIterations = 0;

function mergeSortArray(array) {
    if (array.length <= 1) {
        return array;
    }

    const middle = Math.floor(array.length / 2);
    const left = array.slice(0, middle);
    const right = array.slice(middle);

    return merge(
        mergeSortArray(left),
        mergeSortArray(right)
    );
}

function merge(left, right) {
    let resultArray = [], leftIndex = 0, rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        mergeSortIterations++;
        if (left[leftIndex].review_count < right[rightIndex].review_count) {
            resultArray.push(left[leftIndex]);
            leftIndex++;
        } else {
            resultArray.push(right[rightIndex]);
            rightIndex++;
        }
    }
    return resultArray
        .concat(left.slice(leftIndex))
        .concat(right.slice(rightIndex));
}

document.getElementById('mergeSortArray').addEventListener('click', function(){
    mergeSortIterations = 0;  // Reset iterations count
    const startTime = performance.now();
    mergeSortArray(array);
    const endTime = performance.now();
    const arrayMergeTime = (endTime - startTime) / 1000;
    document.getElementById('arrayMergeTime').textContent = `Tiempo de ordenamiento del array: ${arrayMergeTime.toFixed(4)} segundos, Iteraciones: ${mergeSortIterations}`;
});



document.getElementById('sortListMerge').addEventListener('click', function() {
    const startTime = performance.now();
    const [sortedHead, iterations] = linkedList.mergeSort();
    linkedList.head = sortedHead;
    const endTime = performance.now();
    listMergeTime = endTime - startTime;
    document.getElementById('sortTimeList').textContent = `Tiempo de ordenamiento de la lista enlazada (Merge Sort): ${listMergeTime.toFixed(4)} ms, Iteraciones: ${iterations}`;
});

document.getElementById('compareMergeTimes').addEventListener('click', function(){
    if (arrayMergeTime > 0 && listMergeTime > 0) {
        generarGraficaMerge(arrayMergeTime, listMergeTime);
    } else {
        alert('Debe ordenar ambos conjuntos de datos antes de comparar.');
    }
});

function generarGraficaMerge(arrayMergeTime, listMergeTime) {
    const ctx = document.getElementById('myChartMerge').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Array', 'LinkedList'],
            datasets: [{
                label: 'Tiempo de Ordenamiento (segundos)',
                data: [arrayMergeTime, listMergeTime],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

let radixSortIterations = 0;

function radixSort(array) {
    const max = getMax(array);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        countSort(array, exp);
    }
}

function getMax(array) {
    let max = array[0].review_count;
    for (let i = 1; i < array.length; i++) {
        if (array[i].review_count > max) {
            max = array[i].review_count;
        }
    }
    return max;
}

function countSort(array, exp) {
    const output = new Array(array.length).fill(0);
    const count = new Array(10).fill(0);

    for (let i = 0; i < array.length; i++) {
        radixSortIterations++;
        const index = Math.floor(array[i].review_count / exp) % 10;
        count[index]++;
    }

    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    for (let i = array.length - 1; i >= 0; i--) {
        radixSortIterations++;
        const index = Math.floor(array[i].review_count / exp) % 10;
        output[count[index] - 1] = array[i];
        count[index]--;
    }

    for (let i = 0; i < array.length; i++) {
        array[i] = output[i];
    }
}

document.getElementById('radixSortArray').addEventListener('click', function(){
    radixSortIterations = 0;  
    const startTime = performance.now();
    radixSort(array);
    const endTime = performance.now();
    const arrayRadixTime = (endTime - startTime) / 1000;
    document.getElementById('arrayRadixTime').textContent = `Tiempo de ordenamiento del array: ${arrayRadixTime.toFixed(4)} segundos, Iteraciones: ${radixSortIterations}`;
});


document.getElementById('sortListRadix').addEventListener('click', function() {
    const startTime = performance.now();
    linkedList.radixSort();
    const iterations = linkedList.radixSort();
    const endTime = performance.now();
    listRadixTime = endTime - startTime;
    document.getElementById('sortTimeListRadix').textContent = `Tiempo de ordenamiento de la lista enlazada (Radix Sort): ${listRadixTime.toFixed(4)} ms, Iteraciones: ${iterations}`;
});

document.getElementById('compareRadixTimes').addEventListener('click', function(){
    if (arrayRadixTime > 0 && listRadixTime > 0) {
        generarGraficaRadix(arrayRadixTime, listRadixTime);
    } else {
        alert('Debe ordenar ambos conjuntos de datos antes de comparar.');
    }
});

function generarGraficaRadix(arrayRadixTime, listRadixTime) {
    const ctx = document.getElementById('myChartRadix').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Array', 'LinkedList'],
            datasets: [{
                label: 'Tiempo de Ordenamiento (segundos)',
                data: [arrayRadixTime, listRadixTime],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });   
}


function linearSearchArray(array, reviewCount) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].review_count === reviewCount) {
            return array[i];
        }
    }
    return null;

}
document.getElementById('searchArray').addEventListener('click', function() {
    const reviewCount = parseInt(prompt("Ingrese el review_count a buscar:"), 10);
    if (!isNaN(reviewCount)) {
        const startTime = performance.now();
        const result= linearSearchArray(array, reviewCount);
        const endTime = performance.now();
        const searchTime = endTime - startTime;
        if (result) {
            alert(`Elemento encontrado: ${JSON.stringify(result)}, Tiempo de búsqueda: ${searchTime.toFixed(8)} ms`);
        } else {
            alert(`Elemento no encontrado, Tiempo de búsqueda: ${searchTime.toFixed(6)} ms`);
        }
    } else {
        alert("Por favor ingrese un número válido");
    }
});




document.getElementById('searchList').addEventListener('click', function() {
    const reviewCount = parseInt(prompt("Ingrese el review_count a buscar:"), 10);
    if (!isNaN(reviewCount)) {
        const startTime = performance.now();
        const result = linkedList.linearSearch(reviewCount);
        const endTime = performance.now();
        const searchTime = endTime - startTime;
        if (result) {
            alert(`Elemento encontrado: ${JSON.stringify(result)}, Tiempo de búsqueda: ${searchTime.toFixed(8)} ms`);
        } else {
            alert(`Elemento no encontrado, Tiempo de búsqueda: ${searchTime.toFixed(6)} ms`);
        }
    } else {
        alert("Por favor ingrese un número válido");
    }
});





