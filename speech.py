from gtts import gTTS
import os
import sys
tts = gTTS(text=sys.argv[1], lang='en')
tts.save("speech.mp3")
