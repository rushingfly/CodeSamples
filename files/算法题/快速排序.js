function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        // 找到分区点
        const partitionIndex = partition(arr, left, right);

        // 递归排序左右两部分
        quickSort(arr, left, partitionIndex - 1);
        quickSort(arr, partitionIndex + 1, right);
    }

    return arr;
}

function partition(arr, left, right) {
    // 选择最右边的元素作为基准
    const pivot = arr[right];
    let i = left - 1;

    // 将小于基准的元素移到左边，大于基准的元素移到右边
    for (let j = left; j < right; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr, i, j);
        }
    }

    // 将基准元素放到正确的位置
    swap(arr, i + 1, right);

    return i + 1;
}

function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}

// 测试
const array = [3, 6, 8, 10, 1, 2, 1];
console.log(quickSort(array)); // 输出: [1, 1, 2, 3, 6, 8, 10]