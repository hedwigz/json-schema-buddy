app.directive("dropzone", function () {
    return {
        compile: function (tElem, attrs) {
            return function (scope, elem, attrs) {

                // ReSharper disable once ConstructorCallNotUsed
                // init dropzones
                new Dropzone(elem[0], {
                    // Set the max size of a file that dropzone will handle
                    maxFilesize: 5, // 5MB
                    // implement my own onSuccess event
                    success: function onUploadSuccess(file, response) {
                        if (file.xhr.status === 200) {
                            window.editors[attrs['dropzone']].setValue(response, -1);
                        }
                    },
                    addedfile: function onAddedFile(file){
                        console.log(file);
                    }
                });

            };
        }
    };
});