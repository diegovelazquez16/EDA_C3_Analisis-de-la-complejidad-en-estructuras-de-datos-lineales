import { Node } from './node.js';

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    add(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }

    linearSearch(reviewCount) {
        let current = this.head;
        while (current) {
            if (current.data.review_count === reviewCount) {
                return current.data;
            }
            current = current.next;
        }
        return null;
    }

    bubbleSort() {
        let swapped;
        let iterations = 0;
        do {
            swapped = false;
            let current = this.head;
            while (current && current.next) {
                iterations++;
                if (current.data.review_count > current.next.data.review_count) {
                    let temp = current.data;
                    current.data = current.next.data;
                    current.next.data = temp;
                    swapped = true;
                }
                current = current.next;
            }
        } while (swapped);
        return iterations;
    }

    mergeSort(node = this.head, iterations = { count: 0 }) {
        if (!node || !node.next) {
            return [node, iterations.count];
        }

        const middle = this.getMiddle(node);
        const nextToMiddle = middle.next;

        middle.next = null;

        const [left, leftIterations] = this.mergeSort(node, iterations);
        const [right, rightIterations] = this.mergeSort(nextToMiddle, iterations);

        const merged = this.sortedMerge(left, right, iterations);

        return [merged, iterations.count];
    }

    getMiddle(node) {
        if (!node) return node;
        let slow = node, fast = node;
        while (fast.next && fast.next.next) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }

    sortedMerge(a, b, iterations) {
        let result;
        if (!a) return b;
        if (!b) return a;

        if (a.data.review_count <= b.data.review_count) {
            result = a;
            result.next = this.sortedMerge(a.next, b, iterations);
        } else {
            result = b;
            result.next = this.sortedMerge(a, b.next, iterations);
        }

        iterations.count++;
        return result;
    }

    getMax() {
        let current = this.head;
        let max = current.data.review_count;
        while (current) {
            if (current.data.review_count > max) {
                max = current.data.review_count;
            }
            current = current.next;
        }
        return max;
    }

    countSort(exp) {
        let output = new Array(this.size);
        let count = new Array(10).fill(0);
        let current = this.head;

        while (current) {
            let index = Math.floor(current.data.review_count / exp) % 10;
            count[index]++;
            current = current.next;
        }

        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        current = this.head;
        while (current) {
            let index = Math.floor(current.data.review_count / exp) % 10;
            output[count[index] - 1] = current.data;
            count[index]--;
            current = current.next;
        }

        current = this.head;
        for (let i = 0; i < output.length; i++) {
            if (current) {
                current.data = output[i];
                current = current.next;
            }
        }
    }

    radixSort() {
        let iterations = 0;
        let max = this.getMax();
        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            this.countSort(exp);
            iterations++;
        }
        return iterations;
    }
}

export default LinkedList;
