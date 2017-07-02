gtts-cli "$1" -l 'en-uk' -o "web/audio/speech/$1-google.mp3"
say -v "Daniel" "$1" -o "web/audio/speech/$1-male.aiff"
say -v "Samantha" "$1" -o "web/audio/speech/$1-female.aiff"
