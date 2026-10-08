const STORAGE_KEY =
    "medicineReminderData";

const LANGUAGE_KEY =
    "medicineReminderLanguage";

const translations = {
    en: {
        eyebrow: "MY HEALTH",
        appTitle: "Medicine Reminder",
        todaysMedicines: "Today's Medicines",
        addMedicine: "＋ Add Medicine",
        modalAddMedicine: "Add Medicine",
        disclaimer: "This app only reminds you about medicines you enter. It does not provide medical advice.",
        developedBy: "Developed by",
        medicineName: "Medicine Name",
        medicineNamePlaceholder: "e.g. Napa",
        dosage: "Dosage",
        dosagePlaceholder: "e.g. 1 tablet",
        timesPerDay: "How many times a day?",
        oneTime: "1 time",
        twoTimes: "2 times",
        threeTimes: "3 times",
        fourTimes: "4 times",
        doseTimes: "Dose Times",
        whenToTake: "When to take?",
        anyTime: "Any time",
        beforeMeal: "🍽️ Before meal",
        afterMeal: "🍽️ After meal",
        withMeal: "🍽️ With meal",
        repeat: "Repeat",
        repeatDaysQuestion: "For how many days?",
        days: "Days",
        untilStopped: "Until I stop it",
        notes: "Notes",
        notesPlaceholder: "e.g. Drink with plenty of water",
        saveMedicine: "Save Medicine",
        close: "Close",
        enableNotifications: "Enable notifications",
        notificationHintLine1: "Tap 🔔 to allow",
        notificationHintLine2: "notification",
        emptyMedicines: "No medicines added yet.",
        emptyHint: 'Tap "Add Medicine" to get started.',
        taken: "Taken",
        pending: "Pending",
        markTaken: "Mark Taken",
        deleteMedicine: "Delete",
        stopReminder: "Stop reminders",
        courseComplete: "Course complete — reminders stopped",
        remindersStopped: "Reminders stopped",
        dose: "Dose",
        enterRepeatDays: "Please enter how many days.",
        notificationsUnsupported: "This browser does not support notifications.",
        notificationPermissionDenied: "Notifications are blocked. Allow them in your browser settings.",
        notificationError: "Push setup failed. Check HTTPS and server configuration.",
        notificationsEnabled: "Notifications are enabled.",
        notificationTitle: "💊 Medicine Reminder",
        reminderMessage: "Time to take {name} — {dosage}",
        languageButton: "বাংলা",
        switchLanguage: "Switch language to Bangla"
    },
    bn: {
        eyebrow: "আমার স্বাস্থ্য",
        appTitle: "Medicine Reminder",
        todaysMedicines: "আজকের ওষুধ",
        addMedicine: "＋ ওষুধ যোগ করুন",
        modalAddMedicine: "ওষুধ যোগ করুন",
        disclaimer: "এই অ্যাপটি শুধু আপনার যোগ করা ওষুধের কথা মনে করিয়ে দেয়। এটি চিকিৎসা-পরামর্শ দেয় না।",
        developedBy: "Developed by",
        medicineName: "ওষুধের নাম",
        medicineNamePlaceholder: "যেমন: নাপা",
        dosage: "মাত্রা",
        dosagePlaceholder: "যেমন: ১টি ট্যাবলেট",
        timesPerDay: "দিনে কতবার?",
        oneTime: "১ বার",
        twoTimes: "২ বার",
        threeTimes: "৩ বার",
        fourTimes: "৪ বার",
        doseTimes: "ওষুধ খাওয়ার সময়",
        whenToTake: "কখন খাবেন?",
        anyTime: "যেকোনো সময়",
        beforeMeal: "🍽️ খাবারের আগে",
        afterMeal: "🍽️ খাবারের পরে",
        withMeal: "🍽️ খাবারের সঙ্গে",
        repeat: "পুনরাবৃত্তি",
        repeatDaysQuestion: "কত দিন ধরে?",
        days: "দিন",
        untilStopped: "বন্ধ না করা পর্যন্ত",
        notes: "নোট",
        notesPlaceholder: "যেমন: পর্যাপ্ত পানি দিয়ে খাবেন",
        saveMedicine: "ওষুধ সংরক্ষণ করুন",
        close: "বন্ধ করুন",
        enableNotifications: "নোটিফিকেশন চালু করুন",
        notificationHintLine1: "নোটিফিকেশনের অনুমতি",
        notificationHintLine2: "দিতে 🔔 চাপুন",
        emptyMedicines: "এখনও কোনো ওষুধ যোগ করা হয়নি।",
        emptyHint: "শুরু করতে “ওষুধ যোগ করুন” চাপুন।",
        taken: "খাওয়া হয়েছে",
        pending: "বাকি",
        markTaken: "খাওয়া হয়েছে চিহ্নিত করুন",
        deleteMedicine: "Delete",
        stopReminder: "রিমাইন্ডার বন্ধ করুন",
        courseComplete: "মেয়াদ শেষ — রিমাইন্ডার বন্ধ",
        remindersStopped: "রিমাইন্ডার বন্ধ করা হয়েছে",
        dose: "ডোজ",
        enterRepeatDays: "কত দিন ধরে খাবেন, তা লিখুন।",
        notificationsUnsupported: "এই ব্রাউজারে নোটিফিকেশন সমর্থিত নয়।",
        notificationPermissionDenied: "নোটিফিকেশন বন্ধ আছে। ব্রাউজারের সেটিংস থেকে অনুমতি দিন।",
        notificationError: "পুশ চালু করা যায়নি। HTTPS ও সার্ভার কনফিগারেশন দেখুন।",
        notificationsEnabled: "নোটিফিকেশন চালু হয়েছে।",
        notificationTitle: "💊 Medicine Reminder",
        reminderMessage: "{name} খাওয়ার সময় হয়েছে — {dosage}",
        languageButton: "English",
        switchLanguage: "ভাষা ইংরেজিতে পরিবর্তন করুন"
    }
};

let language =
    localStorage.getItem(LANGUAGE_KEY) === "bn"
        ? "bn"
        : "en";

const t = key =>
    translations[language][key] ||
    translations.en[key] ||
    key;


let medicines =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );

let lastRenderedDay = "";



const $ = id =>
    document.getElementById(id);



/* =========================
   DATE
========================= */

function showDate() {

    const today = new Date();

    $("today").textContent =
        today.toLocaleDateString(
            language === "bn"
                ? "bn-BD"
                : "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric"
            }
        );

}


function getLocalDateKey(date = new Date()) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function getMedicineStatus(medicine) {

    if (medicine.active === false)
        return "stopped";

    if (medicine.repeatType !== "days")
        return "active";

    const repeatDays =
        Number(medicine.repeatDays);

    if (
        !Number.isInteger(repeatDays) ||
        repeatDays < 1
    )
        return "complete";

    if (!medicine.repeatStartDate) {

        medicine.repeatStartDate =
            getLocalDateKey();

        saveData();

    }

    const startParts =
        medicine.repeatStartDate
            .split("-")
            .map(Number);

    const todayParts =
        getLocalDateKey()
            .split("-")
            .map(Number);

    const startDay =
        Date.UTC(
            startParts[0],
            startParts[1] - 1,
            startParts[2]
        );

    const today =
        Date.UTC(
            todayParts[0],
            todayParts[1] - 1,
            todayParts[2]
        );

    const elapsedDays =
        Math.floor(
            (today - startDay) / 86400000
        );

    return elapsedDays < repeatDays
        ? "active"
        : "complete";

}


function applyLanguage() {

        document.documentElement.lang =
            language === "bn"
                ? "bn"
                : "en";

        document.title =
            t("appTitle");

        document.querySelectorAll("[data-i18n]")
            .forEach(element => {
                element.textContent =
                    t(element.dataset.i18n);
            });

        document.querySelectorAll("[data-i18n-placeholder]")
            .forEach(element => {
                element.placeholder =
                    t(element.dataset.i18nPlaceholder);
            });

        $("languageToggle").textContent =
            t("languageButton");

        $("languageToggle").setAttribute(
            "aria-label",
            t("switchLanguage")
        );

        $("notifyBtn").title =
            t("enableNotifications");

        $("notifyBtn").setAttribute(
            "aria-label",
            t("enableNotifications")
        );

        $("closeBtn").title =
            t("close");

        $("closeBtn").setAttribute(
            "aria-label",
            t("close")
        );

        showDate();
        renderMedicines();
        queuePushSync();

}



/* =========================
   SAVE
========================= */

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(medicines)
    );

    queuePushSync();

}


function base64UrlToUint8Array(value) {

    const padding =
        "=".repeat((4 - value.length % 4) % 4);

    const base64 =
        (value + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");

    const raw =
        atob(base64);

    return Uint8Array.from(
        raw,
        character => character.charCodeAt(0)
    );

}


async function syncPushSubscription(subscription) {

    const details = {
        subscription: subscription.toJSON(),
        language,
        timeZone:
            Intl.DateTimeFormat()
                .resolvedOptions()
                .timeZone
    };

    const registerResponse =
        await fetch("/api/push/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(details)
        });

    if (!registerResponse.ok) {
        throw new Error(
            `Push subscription registration failed (${registerResponse.status}).`
        );
    }

    const safeMedicines =
        medicines.map(medicine => ({
            id: medicine.id,
            name: medicine.name,
            dosage: medicine.dosage,
            repeatType: medicine.repeatType,
            repeatDays: medicine.repeatDays,
            repeatStartDate: medicine.repeatStartDate,
            active: medicine.active,
            doses: medicine.doses.map(dose => ({
                time: dose.time
            }))
        }));

    const medicinesResponse =
        await fetch("/api/push/medicines", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...details,
                medicines: safeMedicines
            })
        });

    if (!medicinesResponse.ok) {
        throw new Error(
            `Medicine schedule sync failed (${medicinesResponse.status}).`
        );
    }

}


let pushSyncTimer;

function queuePushSync() {

    if (
        !("Notification" in window) ||
        Notification.permission !== "granted" ||
        !("serviceWorker" in navigator)
    )
        return;

    clearTimeout(pushSyncTimer);
    pushSyncTimer = setTimeout(async function() {

        try {

            const registration =
                await navigator.serviceWorker.ready;

            const subscription =
                await registration.pushManager.getSubscription();

            if (subscription)
                await syncPushSubscription(subscription);

        } catch (error) {

            console.error(
                "Push schedule sync failed:",
                error
            );

        }

    }, 500);

}



/* =========================
   TIME FORMAT
========================= */

function formatTime(time) {

    const [hour, minute] =
        time.split(":");

    const date = new Date();

    date.setHours(
        Number(hour),
        Number(minute)
    );

    return date.toLocaleTimeString(
        language === "bn"
            ? "bn-BD"
            : "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}



/* =========================
   MEAL TEXT
========================= */

function mealText(type) {

    if (type === "before")
        return t("beforeMeal");

    if (type === "after")
        return t("afterMeal");

    if (type === "with")
        return t("withMeal");

    return t("anyTime");
}


async function showAppNotification(title, options) {

    if ("serviceWorker" in navigator) {

        const registration =
            await navigator.serviceWorker.getRegistration();

        if (!registration)
            throw new Error("Service Worker is not registered.");

        await registration.showNotification(
            title,
            options
        );

        return;

    }

    new Notification(
        title,
        options
    );

}



/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

    return text.replace(
        /[&<>"']/g,
        character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[character])
    );

}



/* =========================
   RENDER MEDICINES
========================= */

function renderMedicines() {

    const list =
        $("medicineList");


    $("count").textContent =
        medicines.length;


    if (medicines.length === 0) {

        list.innerHTML = `
        
            <div class="empty">

                💊

                <br><br>

                ${t("emptyMedicines")}

                <br>

                ${t("emptyHint")}

            </div>

        `;

        return;
    }



    list.innerHTML =
        medicines.map(medicine => {

            const status =
                getMedicineStatus(medicine);

            return `

        <article class="medicine">


            <div class="medicine-header">

                <div>

                    <h3>
                        💊
                        ${escapeHTML(
                            medicine.name
                        )}
                    </h3>


                    <p class="dosage">

                        ${escapeHTML(
                            medicine.dosage
                        )}

                    </p>


                    <span class="meal">

                        ${mealText(
                            medicine.mealTiming
                        )}

                    </span>

                </div>


            </div>

            ${
                status === "active"
                    ? ""
                    : `
                <p class="medicine-state">
                    ${
                        status === "complete"
                            ? t("courseComplete")
                            : t("remindersStopped")
                    }
                </p>
                `
            }



            ${
                medicine.notes
                ?
                `
                <div class="notes">

                    📝
                    ${escapeHTML(
                        medicine.notes
                    )}

                </div>
                `
                :
                ""
            }



            <div class="dose-list">

                ${
                    medicine.doses
                    .map(
                        (dose, index) => `

                    <div class="dose-item">

                        <div class="dose-info">

                            <span class="dose-time">

                                ⏰
                                ${formatTime(
                                    dose.time
                                )}

                            </span>


                            <span class="dose-status">

                                ${
                                    dose.taken
                                    ? t("taken")
                                    : t("pending")
                                }

                            </span>

                        </div>



                        ${
                            status === "active"
                                ? `
                            <button
                                class="
                                    status-btn
                                    ${
                                        dose.taken
                                            ? "taken"
                                            : ""
                                    }
                                "
                                onclick="
                                    toggleDose(
                                        '${medicine.id}',
                                        ${index}
                                    )
                                ">
                                ${
                                    dose.taken
                                        ? `✓ ${t("taken")}`
                                        : t("markTaken")
                                }
                            </button>
                            `
                                : ""
                        }

                    </div>

                `
                    )
                    .join("")
                }

            </div>

            ${
                status === "active" &&
                medicine.repeatType !== "days"
                    ? `
                <button
                    class="stop-btn"
                    onclick="stopMedicineReminder('${medicine.id}')">
                    ${t("stopReminder")}
                </button>
                `
                    : ""
            }



            <button

                class="delete-btn"

                onclick="
                    deleteMedicine(
                        '${medicine.id}'
                    )
                "

            >

                ${t("deleteMedicine")}

            </button>


        </article>

    `;
        }).join("");

}



/* =========================
   TOGGLE DOSE
========================= */

window.toggleDose =
    function(id, doseIndex) {

        const medicine =
            medicines.find(
                item =>
                    item.id === id
            );


        if (!medicine)
            return;


        medicine.doses[
            doseIndex
        ].taken =
            !medicine.doses[
                doseIndex
            ].taken;


        saveData();

        renderMedicines();

    };


window.stopMedicineReminder =
    function(id) {

        const medicine =
            medicines.find(
                item =>
                    item.id === id
            );

        if (!medicine)
            return;

        medicine.active = false;

        saveData();
        renderMedicines();

    };



/* =========================
   DELETE
========================= */

window.deleteMedicine =
    function(id) {

        medicines =
            medicines.filter(
                medicine =>
                    medicine.id !== id
            );


        saveData();

        renderMedicines();

    };



/* =========================
   GENERATE TIME INPUTS
========================= */

function generateDoseInputs() {

    const number =
        Number(
            $("timesPerDay").value
        );


    const container =
        $("doseTimes");


    container.innerHTML = "";



    for (
        let i = 0;
        i < number;
        i++
    ) {

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "dose-input";


        wrapper.innerHTML = `

            <label>

                <span data-i18n="dose">${t("dose")}</span> ${
                    new Intl.NumberFormat(
                        language === "bn"
                            ? "bn-BD"
                            : "en-US"
                    ).format(i + 1)
                }

                <input

                    type="time"

                    class="dose-time-input"

                    required

                >

            </label>

        `;


        container.appendChild(
            wrapper
        );

    }

}



/* =========================
   MODAL
========================= */

$("addBtn").onclick =
    function() {

        $("modal")
            .classList
            .remove("hidden");


        generateDoseInputs();


        $("name").focus();

    };



$("closeBtn").onclick =
    function() {

        $("modal")
            .classList
            .add("hidden");

    };



$("languageToggle").onclick =
    function() {

        language =
            language === "en"
                ? "bn"
                : "en";

        localStorage.setItem(
            LANGUAGE_KEY,
            language
        );

        applyLanguage();

    };



$("modal").onclick =
    function(event) {

        if (
            event.target.id ===
            "modal"
        ) {

            $("modal")
                .classList
                .add("hidden");

        }

    };



/* =========================
   TIMES CHANGE
========================= */

$("timesPerDay").onchange =
    function() {

        generateDoseInputs();

    };



/* =========================
   ADD MEDICINE
========================= */

$("medicineForm").onsubmit =
    function(event) {

        event.preventDefault();

        const repeatType =
            document.querySelector(
                'input[name="repeatType"]:checked'
            ).value;

        const repeatDays =
            repeatType === "days"
                ? Number($("repeatDays").value)
                : null;

        if (
            repeatType === "days" &&
            (!repeatDays || repeatDays < 1)
        ) {

            alert(
                t("enterRepeatDays")
            );

            return;

        }



        const timeInputs =
            document.querySelectorAll(
                ".dose-time-input"
            );


        const doses =
            Array.from(
                timeInputs
            ).map(input => ({

                time:
                    input.value,

                taken:
                    false,

                lastNotified:
                    null

            }));



        const medicine = {

            id:
                Date.now().toString(),

            name:
                $("name")
                    .value
                    .trim(),

            dosage:
                $("dosage")
                    .value
                    .trim(),

            mealTiming:
                $("mealTiming")
                    .value,

            repeatType:
                repeatType,

            repeatDays:
                repeatDays,

            repeatStartDate:
                getLocalDateKey(),

            active:
                true,

            notes:
                $("notes")
                    .value
                    .trim(),

            doses:

                doses

        };



        medicines.push(
            medicine
        );


        saveData();

        renderMedicines();


        event.target.reset();


        $("modal")
            .classList
            .add("hidden");

    };



/* =========================
   NOTIFICATION
========================= */

$("notifyBtn").onclick =
    async function() {

        if (
            !(
                "Notification"
                in window
            )
        ) {

            alert(
                t("notificationsUnsupported")
            );

            return;

        }

        if (!window.isSecureContext) {

            alert(
                t("notificationsUnsupported")
            );

            return;

        }



        const permission =
            await Notification
                .requestPermission();



        if (
            permission ===
            "granted"
        ) {

            try {

                if (!("serviceWorker" in navigator)) {
                    throw new Error(
                        "Service Workers are not supported by this browser."
                    );
                }

                const keyResponse =
                    await fetch("/api/push/public-key");

                if (!keyResponse.ok) {
                    throw new Error(
                        `Push server configuration unavailable (${keyResponse.status}).`
                    );
                }

                const { publicKey } =
                    await keyResponse.json();

                if (!publicKey) {
                    throw new Error(
                        "Push server did not provide a VAPID public key."
                    );
                }

                const registration =
                    await navigator.serviceWorker.ready;

                let subscription =
                    await registration.pushManager.getSubscription();

                if (!subscription) {
                    subscription =
                        await registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey:
                                base64UrlToUint8Array(publicKey)
                        });
                }

                await syncPushSubscription(subscription);

                await showAppNotification(
                    t("appTitle"),
                    {
                        body:
                            t("notificationsEnabled"),
                        tag: "medicine-reminder-test",
                        requireInteraction: true,
                        vibrate: [
                            200,
                            100,
                            200
                        ]
                    }
                );

            } catch (error) {

                console.error(
                    "Push notification setup failed:",
                    error
                );

                alert(
                    t("notificationError")
                );

            }

        } else {

            alert(
                t("notificationPermissionDenied")
            );

        }

    };



/* =========================
   REMINDER CHECK
========================= */

function checkReminders() {

    const now =
        new Date();

    const today = getLocalDateKey(now);

    if (today !== lastRenderedDay) {

        lastRenderedDay = today;
        renderMedicines();

    }

}



/* =========================
   START
========================= */

applyLanguage();


generateDoseInputs();



setInterval(
    checkReminders,
    15000
);



/* =========================
   SERVICE WORKER
========================= */

if (
    "serviceWorker"
    in navigator
) {

    window.addEventListener(
        "load",
        function() {

            navigator
                .serviceWorker
                .register("sw.js")
                .then(async registration => {

                    if (
                        "Notification" in window &&
                        Notification.permission === "granted"
                    ) {

                        const subscription =
                            await registration.pushManager.getSubscription();

                        if (subscription)
                            await syncPushSubscription(subscription);

                    }

                })
                .catch(
                    error =>
                        console.log(
                            "Service Worker Error:",
                            error
                        )
                );

        }
    );

}