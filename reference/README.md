# Reference videos (quality bar)

`polish.mp4`, `slash.mp4`, `reveal.mp4` and `weapon.mp4` are third-party clips used only as a visual reference.
They and the extracted frames are git-ignored: do not commit or ship them.

Re-extract frames at 10 fps (frame N is at (N-1)/10 seconds):

    for n in polish slash reveal weapon; do
      mkdir -p reference/frames/$n
      ffmpeg -i reference/$n.mp4 -vf fps=10 -q:v 4 reference/frames/$n/%04d.jpg
    done
