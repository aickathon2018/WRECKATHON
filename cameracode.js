<!DOCTYPE html>
<html>
  <head>
  </head>
  <body onload="init();">
    <h1>Take a snapshot of the current video stream</h1>
   Click on the Start WebCam button.
     <p>
<button onclick="startWebcam();">Start WebCam</button>
    <button onclick="stopWebcam();">Stop WebCam</button> 
       <button onclick="snapshot();">Take Snapshot</button> 
    </p>
    <video onclick="snapshot(this);" width=400 height=400 id="video" controls autoplay></video>
  <p>

        Screenshots : <p>
      <canvas  id="myCanvas" width="400" height="350"></canvas>  
  </body>
  <script
    src="https://code.jquery.com/jquery-3.3.1.js"
    integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60="
    crossorigin="anonymous"></script>
  <script>
      //--------------------
      // GET USER MEDIA CODE
      //--------------------
          navigator.getUserMedia = ( navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia);

      var video;
      var webcamStream;

      function startWebcam() {
        if (navigator.getUserMedia) {
           navigator.getUserMedia (

              // constraints
              {
                 video: true,
                 audio: false
              },

              // successCallback
              function(localMediaStream) {
                  video = document.querySelector('video');
                 video.src = window.URL.createObjectURL(localMediaStream);
                 webcamStream = localMediaStream;
              },

              // errorCallback
              function(err) {
                 console.log("The following error occured: " + err);
              }
           );
        } else {
           console.log("getUserMedia not supported");
        }  
      }

      function stopWebcam() {
          webcamStream.stop();
      }
      //---------------------
      // TAKE A SNAPSHOT CODE
      //---------------------
      var canvas, ctx, image;

      function init() {
        // Get the canvas and obtain a context for
        // drawing in it
        canvas = document.getElementById("myCanvas");
        ctx = canvas.getContext('2d');
      }

      function snapshot() {
         // Draws current image from the video element into the canvas
        ctx.drawImage(video, 0,0, canvas.width, canvas.height);
        canvas.toBlob(function(blob) {
          uploadFile(blob);
        },'image/jpeg', 0.90);
      }

      // comment
      function uploadFile(blob) {
      var file = new File([blob], 'temp.jpeg', {type: 'image/jpeg', lastModified: Date.now()});
      var blobFile = file;
      var formData = new FormData();

      // upload image through form (jpg/jpeg/png)
      formData.append("filename", blobFile);

      // change the access_key and secret_key here
      formData.append("access_key", "2ea88012be52ff68c584");
      formData.append("secret_key", "4f092608497e1f43f8acf15fbfb4240a62b99fa9");

      //To use Jquery, you can download it from http://jquery.com/download/
      //or include it from a CDN into your HTML.
      $.ajax({
         url: "https://face.recoqnitics.com/analyze",
         type: "POST",
         data: formData,
         processData: false,
         contentType: false,
         success: function(response) {
             console.log(response);

             if ( response.faces[0].emotions.angry > 0.5||response.faces[0].emotions.sad > 0.5) {
              $('#out').text("Angry Picture")
             } else {
              $('#out').text("Not Angry Picture")

             }


             $('#out2').html(
              "Angry Level: " + response.faces[0].emotions.angry + 
              "<br>Sad Level: " + response.faces[0].emotions.sad
              );
         },
         error: function(jqXHR, textStatus, errorMessage) {
             console.log(errorMessage); // Optional
         }
      });
    }

  </script>
</html>
