// client/src/utils/sounds.js

export const speak = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2; 
    
    // JARVIS tone fix: Chote text ko aur jaldi bolne ke liye
    if (text === "Click") {
        utterance.rate = 1.5;
    }

    window.speechSynthesis.speak(utterance);
  } else {
    console.log("Speech synthesis not supported.");
  }
};