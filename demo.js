'use strict';



i = 0;
function dataProcess() {

    console.log(i)

}

var data = [1, 2, 3, 45, 3, 6, 456, 45, 6, 5, 64];
for (var ele in data) {


    dataProcess();
    console.log(data[ele]);


}
