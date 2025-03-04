console.log("Lets write javascript")
let currentsong = new Audio();
let songs;
let currfolder; // global variables

// Function to convert seconds to MM:SS format
function convertSecondsToTime(seconds) {
    if (isNaN(seconds) || seconds < 0){
        return "00:00";
    }


    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format minutes and seconds to ensure two digits (e.g., "03" instead of "3")
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = remainingSeconds.toFixed(0).padStart(2, '0'); // Ensure no decimals and pad with leading zeros
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currfolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
      songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split(`${currfolder}/`).pop()));

        }
    }
   // show all the songs in the playlist
   let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
   songUL.innerHTML = ""
   for (const song of songs) {
       songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="music.svg" alt="">
                           <div class="info">
                               <div>${song}</div>
                               <div>Ayush</div>
                           </div>
                           <div class="playnow">
                               <span>Play Now</span>
                               <img class="invert" src="play.svg" alt="">  
                                 </div>  </li>`;   // mistake is here

   }
   // Attach an event listener to each song 
   Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
       e.addEventListener("click", element => {
           playMusic(e.querySelector(".info").firstElementChild.innerHTML)
       })

   })

}


const playMusic = (track, pause = false) => {
    // Set the song source
    currentsong.src = `${currfolder}/` + track;

    // If pause is false, play the song, else pause the song
    if (!pause) {
        currentsong.play();  // Play the song
        play.src = "paused.svg"; // Change the play button icon to "paused"
    } else {
        currentsong.pause(); // Pause the song if pause is true
        play.src = "play.svg"; // Change the play button icon to "play"
    }

    // Update the song info
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

};


async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    Array.from(anchors).forEach( async e =>{
        if(e.href.includes("/songs")){
          let folder = e.href.split("/").slice(-2)[0] 

        // no works
        
        }
    })


}

async function main() {

    // Get the list of all the songs
    await getsongs("songs/ncs")
    playMusic(songs[0], true)

    // display all the albums on the page
     displayAlbums()      

  
    // Attach an event listener to play , next and previous  
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "paused.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })

    // Listen for time updatae
    currentsong.addEventListener("timeupdate", () => {
        // Update the time display
        document.querySelector(".songtime").innerHTML = `${convertSecondsToTime(currentsong.currentTime)} /
     ${convertSecondsToTime(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100
            + "%";
    })

    // Add an event listner to seek bar    , changing the time and duration and song duration

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration) * percent / 100

    })

    // add an eventlistner for hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add an eventlistner for close button

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // add tan event listner to previous
    previous.addEventListener("click", () => {
        let index = songs.indexOf(decodeURIComponent(currentsong.src.split("/").pop()));
        if (index > 0) {  
            playMusic(songs[index - 1]); // Play the previous song
        }
    });
    
     // add tan event listner to next song
    next.addEventListener("click", () => {
        let index = songs.indexOf(decodeURIComponent(currentsong.src.split("/").pop()));
        if (index < songs.length - 1) { 
            playMusic(songs[index + 1]); // Play the next song
        }
    });
    

    // add an  event to volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("click",(e)=>{
        currentsong.volume = parseInt(e.target.value)/ 100

    })

    //load the playlist whennever card is clicked

   Array.from(document.getElementsByClassName("card")).forEach(e=> {
    console.log(e);
    
        e.addEventListener("click", async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)

        })
    });

    // Add the event listener to mute a track 

    document.querySelector(".volume>img").addEventListener("click" , e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg" )  
            currentsong.volume = 0 ;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg") 
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20

        }

        
    })

}

main()