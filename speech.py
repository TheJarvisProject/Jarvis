from gtts import gTTS
import os
import sys
tts = gTTS(text=unicode(sys.argv[1], errors='ignore'), lang='en')
tts.save("speech.mp3")
