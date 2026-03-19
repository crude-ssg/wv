# Features
- [x] Update postprocess-worker.py to delete artifacts once generation is completed or fails (uploaded image, resulting video)

- [x] Videos must be saved to /data/videos/$username on the web-server (symlink to webroot to be publicly accessible)

- [x] Make a cooldown of 60 seconds between each generation giving others a chance to make videos

# Bugfixes
- [x] Fix bug where precessing UI will show forever even after generation is completed. meaninng video won't start playing.
- [x] bug where processsing ui resets when there's a new history request.
- [x] fix bug where the video player resets when there is a new history update

# Future Features
- Add Explore Tab
    - [ ] Allow searching through generated videos from all users
    - [ ] Allow filtering by tags or keywords
    - [ ] Implement sorting by newest, oldest, random, username
    - [ ] "Discover" mode for browsing without specific search terms