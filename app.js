function install() {
    const urlParams = new URLSearchParams(window.location.search);
    const appName   = urlParams.get("appName");
    const AppUrl    = urlParams.get("appUrl");
    const thumb     = urlParams.get("thumbUrl");

    var thumbnail = thumb;
    var iconSmall = thumb;
    var iconBig = thumb;
    var storetype = "store";
    var appId = appName;

    Hisense_installApp(appId, appName, thumbnail, iconSmall, iconBig, AppUrl, storetype, installCallBack);

    const current = HiUtils_createRequest('fileRead', {
        path: 'websdk/Appinfo.json',
        mode: 6
    });

    // Parse JSON if it exists, otherwise create an empty structure
    const apps = current.ret ? JSON.parse(current.msg) : {
        AppInfo: []
    };

    // Define the stremio app entry
    const app = {
        Id: appName,
        AppName: appName,
        Title: appName,
        URL: AppUrl,
        StartCommand: AppUrl,
        IconURL: appIcon,
        Icon_96: appIcon,
        Image: appIcon,
        Thumb: appIcon,
        Type: "Browser",
        InstallTime: new Date().toISOString().split('T')[0],
        RunTimes: 0,
        StoreType: "custom",
        PreInstall: false
    };

    // Update existing entry or add a new one
    const index = apps.AppInfo.findIndex(a => a.Id === stremio.Id);
    if (index >= 0) {
        apps.AppInfo[index] = app;
    } else {
        apps.AppInfo.push(app);
    }

    // Write the updated list back to the system file
    HiUtils_createRequest('fileWrite', {
        path: 'websdk/Appinfo.json',
        mode: 6,
        writedata: JSON.stringify(apps)
    });
}

function installCallBack(res) {
    if (res == 0) {
        showPopup("Success", "The app was installed successfully.");
    } else {
        showPopup("Error", "Installation failed. Error code: " + res);
    }
}

// Function to show a popup with a message
function showPopup(title, message) {
    // Create popup elements
    var popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "white";
    popup.style.padding = "20px";
    popup.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
    popup.style.zIndex = "1000";
    popup.style.borderRadius = "5px";
    popup.style.textAlign = "center";

    var titleElem = document.createElement("h2");
    titleElem.innerText = title;
    popup.appendChild(titleElem);

    var messageElem = document.createElement("p");
    messageElem.innerText = message;
    popup.appendChild(messageElem);

    var closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.onclick = function () {
        document.body.removeChild(popup);
    };
    popup.appendChild(closeButton);

    // Append popup to the document body
    document.body.appendChild(popup);
}

const urlParams = new URLSearchParams(window.location.search);
const appName = urlParams.get("appName");
const icon = urlParams.get("appIcon");
const descriptionText = urlParams.get("description")

const logo = document.getElementById("logo");
const name = document.getElementById("name");
const description = document.getElementById("description");
logo.src = icon;
name.innerText = appName;
description.innerText = descriptionText;