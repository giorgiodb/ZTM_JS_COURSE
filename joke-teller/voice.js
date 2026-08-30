// VoiceRSS Javascript SDK (già pronto)
const VoiceRSS = {
    speech(settings) {
        this._validate(settings);
        this._request(settings);
    },

    _validate(settings) {
        if (!settings) throw "The settings are undefined";
        if (!settings.key) throw "The API key is undefined";
        if (!settings.src) throw "The text is undefined";
        if (!settings.hl) throw "The language is undefined";

        if (settings.c && settings.c.toLowerCase() !== "auto") {
            const audio = new Audio();
            const codecs = {
                mp3: "audio/mpeg",
                wav: "audio/wav",
                aac: "audio/aac",
                ogg: "audio/ogg",
                caf: "audio/x-caf"
            };

            const codec = settings.c.toLowerCase();
            const supported = codecs[codec] &&
                audio.canPlayType(codecs[codec]).replace("no", "");

            if (!supported)
                throw `The browser does not support the audio codec ${settings.c}`;
        }
    },

    _request(settings) {
        const request = this._buildRequest(settings);
        const xhr = this._getXHR();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.responseText.startsWith("ERROR"))
                    throw xhr.responseText;

                audioElement.src = xhr.responseText;
                audioElement.play();
            }
        };

        xhr.open("POST", "https://api.voicerss.org/", true);
        xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8"
        );
        xhr.send(request);
    },

    _buildRequest(settings) {
        const codec =
            settings.c && settings.c.toLowerCase() !== "auto"
                ? settings.c
                : this._detectCodec();

        return `key=${settings.key || ""}` +
               `&src=${settings.src || ""}` +
               `&hl=${settings.hl || ""}` +
               `&r=${settings.r || ""}` +
               `&c=${codec || ""}` +
               `&f=${settings.f || ""}` +
               `&ssml=${settings.ssml || ""}` +
               `&b64=true`;
    },

    _detectCodec() {
        const audio = new Audio();
        const codecs = {
            mp3: "audio/mpeg",
            wav: "audio/wav",
            aac: "audio/aac",
            ogg: "audio/ogg",
            caf: "audio/x-caf"
        };

        return Object.entries(codecs)
            .find(([_, type]) => audio.canPlayType(type).replace("no", ""))
            ?.[0] || "";
    },

    _getXHR() {
        return new XMLHttpRequest();
    }
};