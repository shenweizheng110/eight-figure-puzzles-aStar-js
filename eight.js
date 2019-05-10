const initStatus = [
    [2, 8, 3],
    [1, 6, 4],
    [0, 7, 5]
];
const targetStatus = [
    [1, 2, 3],
    [8, 0, 4],
    [7, 6, 5]
];
// 操作数组
const operation = [{
    // 上
    x: -1,
    y: 0
}, {
    // 下
    x: 1,
    y: 0
}, {
    // 左
    x: 0,
    y: -1
}, {
    // 右
    x: 0,
    y: 1
}]
// open表
let open = [];
// close表
let close = [];
// 计算不在位的数量
function notLocation(currentStatus) {
    let sum = 0;
    targetStatus.map((item, index) => {
        item.map((childItem, childIndex) => {
            if (childItem !== currentStatus[index][childIndex])
                sum++;
        })
    });
    return sum;
}

// 找到0所在的位置
function findZero(currentStatus) {
    let x, y;
    currentStatus.map((item, index) => {
        item.map((childItem, childIndex) => {
            if (childItem === 0) {
                x = index;
                y = childIndex;
            }
        })
    });
    return {
        row: x,
        col: y
    }
}

// 判断 open表 close表 中是否存在
function isExist(currentStatus) {
    let flag = false;
    close.map(item => {
        if (JSON.stringify(item) === JSON.stringify(currentStatus))
            flag = true;
    })
    open.map(item => {
        if (JSON.stringify(item.status) === JSON.stringify(currentStatus))
            flag = true;
    })
    return flag;
}

// 交换位置
function wrapLocation(zero, currentStatus, type) {
    // 深拷贝
    currentStatus = currentStatus.map(item => {
        return JSON.parse(JSON.stringify(item));
    });
    switch (type) {
        // 上
        case 0:
            currentStatus[zero.row][zero.col] = currentStatus[zero.row - 1][zero.col];
            currentStatus[zero.row - 1][zero.col] = 0;
            break;
            // 下
        case 1:
            currentStatus[zero.row][zero.col] = currentStatus[zero.row + 1][zero.col];
            currentStatus[zero.row + 1][zero.col] = 0;
            break;
            // 左
        case 2:
            currentStatus[zero.row][zero.col] = currentStatus[zero.row][zero.col - 1];
            currentStatus[zero.row][zero.col - 1] = 0;
            break;
            // 右
        case 3:
            currentStatus[zero.row][zero.col] = currentStatus[zero.row][zero.col + 1];
            currentStatus[zero.row][zero.col + 1] = 0;
            break;
        default:
            console.log(' operation error');
            break;
    }
    return currentStatus;
}

// 主函数
function calStep(depth, currentStatus) {
    /*    // 添加节点
        open.push({
            status: currentStatus,
            fn: depth + notLocation(currentStatus)
        })*/
    // 判断是否是目标矩阵
    console.log('depth:', depth, currentStatus);
    if (JSON.stringify(currentStatus) === JSON.stringify(targetStatus))
        return;
    // open表空 未找到结果
    if (open.length === 0 && close.length !== 0)
        return;
    //  判断是否已走过
    if (isExist(currentStatus)) {

    } else {
        // 不是目标矩阵 继续
        // 找到 0 的位置
        let zero = findZero(currentStatus);
        // 扩展节点
        for (let i = 0; i < operation.length; i++) {
            if (zero.row + operation[i].x >= 0 &&
                zero.row + operation[i].x < initStatus.length &&
                zero.col + operation[i].y >= 0 &&
                zero.col + operation[i].y < initStatus[0].length) {
                let status = wrapLocation(zero, currentStatus, i);
                if (!isExist(status)) {
                    open.push({
                        status: status,
                        depth: depth + 1,
                        fn: depth + 1 + notLocation(status),
                    })
                }
            }
        }

        // open排序
        open.sort((preItem, nextItem) => {
            return preItem.fn - nextItem.fn;
        });
        /*open.map(item => {
            console.log(item.status, item.fn);
        })*/
        // 当前状态进close表
        close.push(currentStatus);
        let minItem = open.shift();
        // console.log('minItem: ', minItem);
        calStep(minItem.depth, minItem.status);
    }
}

calStep(0, initStatus);