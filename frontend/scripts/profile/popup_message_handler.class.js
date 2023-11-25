import Profile from '/frontend/scripts/profile/profile.class.js';

export default class PopupMessageHandler {

    // PROPERTIES

    #message;
    #icons = [
        {
            type: 'saved',
            html: `<svg class="popup-saved-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_112_995)">
                <path class="path-1" d="M19.5 3.00001H17.625C17.5256 3.00001 17.4302 3.03952 17.3598 3.10984C17.2895 3.18017 17.25 3.27555 17.25 3.37501V7.50001C17.25 7.89783 17.092 8.27936 16.8107 8.56067C16.5294 8.84197 16.1478 9.00001 15.75 9.00001H8.27532C8.08145 9.00309 7.89362 8.93253 7.74973 8.80256C7.60584 8.67259 7.5166 8.49288 7.50001 8.2997C7.4932 8.1971 7.50755 8.09421 7.54218 7.9974C7.57681 7.90059 7.63097 7.81194 7.70131 7.73694C7.77164 7.66195 7.85664 7.60222 7.95104 7.56146C8.04543 7.5207 8.14719 7.49978 8.25001 7.50001H15.375C15.4745 7.50001 15.5698 7.4605 15.6402 7.39017C15.7105 7.31985 15.75 7.22446 15.75 7.12501V3.37501C15.75 3.27555 15.7105 3.18017 15.6402 3.10984C15.5698 3.03952 15.4745 3.00001 15.375 3.00001H8.56032C8.36326 2.99938 8.16805 3.03792 7.98602 3.11341C7.804 3.18889 7.63879 3.2998 7.50001 3.43969L3.43969 7.50001C3.2998 7.63879 3.18889 7.804 3.11341 7.98602C3.03792 8.16805 2.99938 8.36326 3.00001 8.56032V19.5C3.00001 19.8978 3.15804 20.2794 3.43935 20.5607C3.72065 20.842 4.10218 21 4.50001 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.50001C21 4.10218 20.842 3.72065 20.5607 3.43935C20.2794 3.15804 19.8978 3.00001 19.5 3.00001ZM12 17.25C11.4067 17.25 10.8266 17.0741 10.3333 16.7444C9.83995 16.4148 9.45543 15.9462 9.22837 15.3981C9.00131 14.8499 8.9419 14.2467 9.05765 13.6647C9.17341 13.0828 9.45913 12.5482 9.87869 12.1287C10.2982 11.7091 10.8328 11.4234 11.4147 11.3077C11.9967 11.1919 12.5999 11.2513 13.1481 11.4784C13.6962 11.7054 14.1648 12.0899 14.4944 12.5833C14.8241 13.0766 15 13.6567 15 14.25C15 15.0457 14.6839 15.8087 14.1213 16.3713C13.5587 16.9339 12.7957 17.25 12 17.25Z" />
                <path class="path-2" d="M16.25 2.50001H14.6875C14.6046 2.50001 14.5251 2.53293 14.4665 2.59154C14.4079 2.65014 14.375 2.72963 14.375 2.81251V6.25001C14.375 6.58153 14.2433 6.89947 14.0089 7.13389C13.7745 7.36831 13.4565 7.50001 13.125 7.50001H6.8961C6.73454 7.50258 6.57801 7.44378 6.45811 7.33547C6.3382 7.22716 6.26383 7.0774 6.25001 6.91641C6.24433 6.83092 6.25629 6.74518 6.28515 6.6645C6.31401 6.58383 6.35914 6.50995 6.41776 6.44745C6.47637 6.38496 6.5472 6.33518 6.62586 6.30121C6.70452 6.26725 6.78933 6.24982 6.87501 6.25001H12.8125C12.8954 6.25001 12.9749 6.21708 13.0335 6.15848C13.0921 6.09987 13.125 6.02039 13.125 5.93751V2.81251C13.125 2.72963 13.0921 2.65014 13.0335 2.59154C12.9749 2.53293 12.8954 2.50001 12.8125 2.50001H7.1336C6.96939 2.49948 6.80671 2.5316 6.65502 2.59451C6.50333 2.65741 6.36566 2.74983 6.25001 2.86641L2.86641 6.25001C2.74983 6.36566 2.65741 6.50333 2.59451 6.65502C2.5316 6.80671 2.49948 6.96939 2.50001 7.1336V16.25C2.50001 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41849 17.5 3.75001 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75001C17.5 3.41849 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.50001 16.25 2.50001ZM10 14.375C9.50555 14.375 9.0222 14.2284 8.61108 13.9537C8.19996 13.679 7.87953 13.2885 7.69031 12.8317C7.50109 12.3749 7.45158 11.8722 7.54804 11.3873C7.64451 10.9023 7.88261 10.4569 8.23224 10.1072C8.58187 9.75761 9.02733 9.51951 9.51228 9.42304C9.99723 9.32658 10.4999 9.37609 10.9567 9.56531C11.4135 9.75453 11.804 10.075 12.0787 10.4861C12.3534 10.8972 12.5 11.3806 12.5 11.875C12.5 12.538 12.2366 13.1739 11.7678 13.6428C11.2989 14.1116 10.663 14.375 10 14.375Z" />
                </g>
                <defs>
                <clipPath id="clip0_112_995">
                <rect width="20" height="20" />
                </clipPath>
                </defs>
            </svg>
            `
        },
        {
            type: 'link',
            html: `<svg class="popup-link-icon" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.15399 12.6509C9.24139 12.738 9.31074 12.8415 9.35806 12.9554C9.40537 13.0694 9.42973 13.1916 9.42973 13.3149C9.42973 13.4383 9.40537 13.5605 9.35806 13.6745C9.31074 13.7884 9.24139 13.8919 9.15399 13.979L8.68993 14.4431C7.81057 15.3224 6.61791 15.8164 5.3743 15.8164C4.1307 15.8164 2.93804 15.3224 2.05868 14.4431C1.17932 13.5637 0.685303 12.371 0.685303 11.1274C0.685303 9.88384 1.17932 8.69117 2.05868 7.81181L3.94305 5.92822C4.78796 5.08122 5.92476 4.58933 7.12057 4.55331C8.31639 4.51729 9.48073 4.93986 10.3751 5.73447C10.4674 5.81655 10.5427 5.91601 10.5966 6.02717C10.6505 6.13833 10.682 6.25902 10.6892 6.38235C10.6965 6.50568 10.6794 6.62923 10.6389 6.74595C10.5984 6.86266 10.5353 6.97026 10.4532 7.06259C10.3711 7.15493 10.2717 7.2302 10.1605 7.28409C10.0493 7.33799 9.92866 7.36947 9.80533 7.37672C9.682 7.38398 9.55845 7.36687 9.44174 7.32638C9.32502 7.28588 9.21742 7.2228 9.12509 7.14072C8.58877 6.66441 7.89074 6.41102 7.17377 6.43237C6.4568 6.45371 5.77508 6.74819 5.26805 7.25556L3.38524 9.13681C2.85771 9.66435 2.56135 10.3798 2.56135 11.1259C2.56135 11.8719 2.85771 12.5874 3.38524 13.1149C3.91277 13.6425 4.62826 13.9388 5.3743 13.9388C6.12035 13.9388 6.83583 13.6425 7.36337 13.1149L7.82743 12.6509C7.9145 12.5637 8.01789 12.4946 8.1317 12.4474C8.24551 12.4002 8.36751 12.3759 8.49071 12.3759C8.61391 12.3759 8.73591 12.4002 8.84972 12.4474C8.96353 12.4946 9.06692 12.5637 9.15399 12.6509ZM14.9415 1.55713C14.0614 0.67912 12.869 0.186035 11.6259 0.186035C10.3827 0.186035 9.19032 0.67912 8.31024 1.55713L7.84618 2.02119C7.67006 2.19731 7.57112 2.43618 7.57112 2.68525C7.57112 2.93432 7.67006 3.17319 7.84618 3.34931C8.0223 3.52543 8.26117 3.62438 8.51024 3.62438C8.75931 3.62438 8.99818 3.52543 9.1743 3.34931L9.63837 2.88525C10.1659 2.35772 10.8814 2.06135 11.6274 2.06135C12.3735 2.06135 13.089 2.35772 13.6165 2.88525C14.144 3.41278 14.4404 4.12827 14.4404 4.87431C14.4404 5.62036 14.144 6.33584 13.6165 6.86338L11.7329 8.74775C11.2254 9.25491 10.5433 9.54896 9.82618 9.56973C9.10903 9.5905 8.41105 9.33641 7.87509 8.85947C7.78275 8.77739 7.67515 8.71431 7.55844 8.67381C7.44172 8.63332 7.31817 8.61621 7.19484 8.62347C7.07152 8.63072 6.95082 8.6622 6.83966 8.7161C6.7285 8.76999 6.62904 8.84526 6.54696 8.9376C6.46488 9.02993 6.4018 9.13753 6.36131 9.25424C6.32081 9.37096 6.30371 9.49451 6.31096 9.61784C6.31821 9.74117 6.34969 9.86186 6.40359 9.97302C6.45748 10.0842 6.53275 10.1836 6.62509 10.2657C7.51882 11.0601 8.68238 11.483 9.87763 11.4477C11.0729 11.4124 12.2095 10.9217 13.0548 10.0759L14.9391 8.19228C15.8182 7.31242 16.3121 6.1197 16.3126 4.87597C16.313 3.63224 15.8199 2.43917 14.9415 1.55869V1.55713Z" />
                </svg>
            `
        }
    ];
    #selectedIcon;
    #displayTime = 4000;

    // METHODS

    // Render Popup Message

    render(appendNode) {
        const popupNode = document.createElement("div");
        popupNode.classList.add("popup-message-container");
        popupNode.dataset.popupmessage = null;

        popupNode.innerHTML = ` ${this.#selectedIcon.html} <h4>${this.#message}</h4>`;

        appendNode.appendChild(popupNode);

        // Remove popup message animation after allotted time passed and then remove node

        setTimeout(() => {
            const node = appendNode.querySelector("[data-popupmessage]");
            node.classList.add("popup-message-slide-out");
            const root = document.querySelector(":root");
            const animationFadeTime = Number(getComputedStyle(root).getPropertyValue('--fade-animation-time').slice(0, -1)) * 1000;
            setTimeout(() => {
                node.remove();
            }, animationFadeTime + 250)
        }, this.#displayTime);
    }

    // CONSTRUCTOR

    constructor(message, selectedIcon, displayTime = null) {
        this.#message = message;
        this.#selectedIcon = this.#icons.find(icon => icon.type === selectedIcon.toLowerCase());
    
        if (displayTime) {
            this.#displayTime = displayTime;
        }
    }

}