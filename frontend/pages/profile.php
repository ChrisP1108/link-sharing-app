<?php
    Component::header();
?>

<div class="profile-page-container">
    <header class="profile-header box-section">
        <?php Component::logo(); ?>
        <section class="links-profile-container tab-container">
            <div class="tab-container" data-tab="links">
                <svg viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.15375 12.6509C9.24115 12.738 9.31049 12.8415 9.35781 12.9554C9.40513 13.0694 9.42949 13.1916 9.42949 13.3149C9.42949 13.4383 9.40513 13.5605 9.35781 13.6745C9.31049 13.7884 9.24115 13.8919 9.15375 13.979L8.68968 14.4431C7.81033 15.3224 6.61766 15.8164 5.37406 15.8164C4.13046 15.8164 2.93779 15.3224 2.05844 14.4431C1.17908 13.5637 0.685059 12.371 0.685059 11.1274C0.685059 9.88384 1.17908 8.69117 2.05844 7.81181L3.94281 5.92822C4.78772 5.08122 5.92451 4.58933 7.12033 4.55331C8.31615 4.51729 9.48048 4.93986 10.3748 5.73447C10.4672 5.81655 10.5424 5.91601 10.5963 6.02717C10.6502 6.13833 10.6817 6.25902 10.689 6.38235C10.6962 6.50568 10.6791 6.62923 10.6386 6.74595C10.5981 6.86266 10.535 6.97026 10.453 7.06259C10.3709 7.15493 10.2714 7.2302 10.1603 7.28409C10.0491 7.33799 9.92841 7.36947 9.80508 7.37672C9.68176 7.38398 9.55821 7.36687 9.44149 7.32638C9.32477 7.28588 9.21718 7.2228 9.12484 7.14072C8.58853 6.66441 7.89049 6.41102 7.17352 6.43237C6.45656 6.45371 5.77483 6.74819 5.26781 7.25556L3.385 9.13681C2.85747 9.66435 2.5611 10.3798 2.5611 11.1259C2.5611 11.8719 2.85747 12.5874 3.385 13.1149C3.91253 13.6425 4.62802 13.9388 5.37406 13.9388C6.1201 13.9388 6.83559 13.6425 7.36312 13.1149L7.82719 12.6509C7.91425 12.5637 8.01765 12.4946 8.13146 12.4474C8.24527 12.4002 8.36726 12.3759 8.49047 12.3759C8.61367 12.3759 8.73566 12.4002 8.84947 12.4474C8.96328 12.4946 9.06668 12.5637 9.15375 12.6509ZM14.9412 1.55713C14.0612 0.67912 12.8688 0.186035 11.6256 0.186035C10.3825 0.186035 9.19007 0.67912 8.31 1.55713L7.84594 2.02119C7.66982 2.19731 7.57087 2.43618 7.57087 2.68525C7.57087 2.93432 7.66982 3.17319 7.84594 3.34931C8.02206 3.52543 8.26093 3.62438 8.51 3.62438C8.75907 3.62438 8.99794 3.52543 9.17406 3.34931L9.63812 2.88525C10.1657 2.35772 10.8811 2.06135 11.6272 2.06135C12.3732 2.06135 13.0887 2.35772 13.6162 2.88525C14.1438 3.41278 14.4401 4.12827 14.4401 4.87431C14.4401 5.62036 14.1438 6.33584 13.6162 6.86338L11.7327 8.74775C11.2252 9.25491 10.5431 9.54896 9.82593 9.56973C9.10878 9.5905 8.41081 9.33641 7.87484 8.85947C7.78251 8.77739 7.67491 8.71431 7.55819 8.67381C7.44148 8.63332 7.31793 8.61621 7.1946 8.62347C7.07127 8.63072 6.95058 8.6622 6.83942 8.7161C6.72825 8.76999 6.62879 8.84526 6.54672 8.9376C6.46464 9.02993 6.40156 9.13753 6.36106 9.25424C6.32057 9.37096 6.30346 9.49451 6.31072 9.61784C6.31797 9.74117 6.34944 9.86186 6.40334 9.97302C6.45724 10.0842 6.53251 10.1836 6.62484 10.2657C7.51858 11.0601 8.68213 11.483 9.87739 11.4477C11.0726 11.4124 12.2092 10.9217 13.0545 10.0759L14.9389 8.19228C15.8179 7.31242 16.3119 6.1197 16.3123 4.87597C16.3128 3.63224 15.8197 2.43917 14.9412 1.55869V1.55713Z"/>
                </svg>
                <h4>Links</h4>
            </div>
            <div class="tab-container" data-tab="profile">
                <svg viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5 0.5625C6.83122 0.5625 5.19992 1.05735 3.81238 1.98448C2.42484 2.9116 1.34338 4.22936 0.70477 5.77111C0.0661559 7.31286 -0.100935 9.00936 0.224628 10.6461C0.550191 12.2828 1.35379 13.7862 2.53379 14.9662C3.7138 16.1462 5.21721 16.9498 6.85393 17.2754C8.49064 17.6009 10.1871 17.4338 11.7289 16.7952C13.2706 16.1566 14.5884 15.0752 15.5155 13.6876C16.4427 12.3001 16.9375 10.6688 16.9375 9C16.935 6.763 16.0453 4.61833 14.4635 3.03653C12.8817 1.45473 10.737 0.564981 8.5 0.5625ZM4.71641 14.357C5.15163 13.7619 5.72107 13.2779 6.37849 12.9442C7.0359 12.6106 7.76276 12.4367 8.5 12.4367C9.23725 12.4367 9.9641 12.6106 10.6215 12.9442C11.2789 13.2779 11.8484 13.7619 12.2836 14.357C11.1778 15.1412 9.85565 15.5625 8.5 15.5625C7.14436 15.5625 5.82221 15.1412 4.71641 14.357ZM6.3125 8.375C6.3125 7.94235 6.4408 7.51942 6.68116 7.15969C6.92153 6.79996 7.26317 6.51958 7.66288 6.35401C8.0626 6.18845 8.50243 6.14513 8.92676 6.22953C9.3511 6.31394 9.74087 6.52228 10.0468 6.8282C10.3527 7.13413 10.5611 7.52391 10.6455 7.94824C10.7299 8.37257 10.6866 8.81241 10.521 9.21212C10.3554 9.61183 10.075 9.95347 9.71531 10.1938C9.35558 10.4342 8.93265 10.5625 8.5 10.5625C7.91984 10.5625 7.36344 10.332 6.95321 9.9218C6.54297 9.51156 6.3125 8.95516 6.3125 8.375ZM13.6563 13.0578C13.0486 12.2849 12.2741 11.6595 11.3906 11.2281C11.9537 10.658 12.3355 9.93402 12.4881 9.14738C12.6408 8.36074 12.5573 7.54653 12.2484 6.80718C11.9394 6.06783 11.4187 5.43637 10.7517 4.99223C10.0847 4.5481 9.30132 4.31112 8.5 4.31112C7.69869 4.31112 6.91528 4.5481 6.24831 4.99223C5.58135 5.43637 5.06062 6.06783 4.75165 6.80718C4.44267 7.54653 4.35925 8.36074 4.51187 9.14738C4.66449 9.93402 5.04634 10.658 5.60938 11.2281C4.72592 11.6595 3.9514 12.2849 3.34375 13.0578C2.58051 12.0903 2.10512 10.9274 1.972 9.70225C1.83888 8.47711 2.05341 7.23925 2.59104 6.13037C3.12867 5.02148 3.96767 4.08639 5.01199 3.43212C6.05631 2.77786 7.26375 2.43086 8.4961 2.43086C9.72844 2.43086 10.9359 2.77786 11.9802 3.43212C13.0245 4.08639 13.8635 5.02148 14.4012 6.13037C14.9388 7.23925 15.1533 8.47711 15.0202 9.70225C14.8871 10.9274 14.4117 12.0903 13.6484 13.0578H13.6563Z"/>
                </svg>
                <h4>Profile Details</h4>
            </div>
        </section>
        <div class="preview-container">
            <a href="/preview">
                <svg viewBox="0 0 52 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M35.6096 20.6195C35.5807 20.5562 34.8963 19.0367 33.3846 17.525C31.3619 15.5055 28.8127 14.4375 26.0002 14.4375C23.1877 14.4375 20.6385 15.5055 18.6182 17.525C17.1064 19.0367 16.4221 20.5562 16.3908 20.6195C16.3379 20.7395 16.3105 20.8692 16.3105 21.0004C16.3105 21.1315 16.3379 21.2613 16.3908 21.3813C16.4197 21.4453 17.1041 22.9641 18.6166 24.4758C20.6385 26.4953 23.1877 27.5625 26.0002 27.5625C28.8127 27.5625 31.3619 26.4953 33.3814 24.4758C34.8939 22.9641 35.5783 21.4453 35.6072 21.3813C35.6605 21.2614 35.6882 21.1318 35.6887 21.0006C35.6891 20.8695 35.6621 20.7397 35.6096 20.6195ZM32.0111 23.1977C30.3338 24.8492 28.3119 25.6875 26.0002 25.6875C23.6885 25.6875 21.6666 24.8492 19.9916 23.1969C19.3325 22.5447 18.7655 21.8056 18.3064 21C18.7657 20.1947 19.3326 19.4559 19.9916 18.8039C21.6674 17.1508 23.6885 16.3125 26.0002 16.3125C28.3119 16.3125 30.333 17.1508 32.0088 18.8039C32.6678 19.4558 33.2348 20.1947 33.6939 21C33.2348 21.8055 32.6678 22.5447 32.0088 23.1969L32.0111 23.1977ZM26.0002 17.5625C25.3203 17.5625 24.6557 17.7641 24.0904 18.1418C23.5251 18.5195 23.0845 19.0564 22.8243 19.6845C22.5642 20.3126 22.4961 21.0038 22.6287 21.6706C22.7614 22.3374 23.0888 22.9499 23.5695 23.4307C24.0502 23.9114 24.6628 24.2388 25.3296 24.3714C25.9964 24.5041 26.6875 24.436 27.3157 24.1758C27.9438 23.9157 28.4806 23.4751 28.8584 22.9098C29.2361 22.3445 29.4377 21.6799 29.4377 21C29.4367 20.0886 29.0742 19.2149 28.4297 18.5705C27.7853 17.926 26.9115 17.5635 26.0002 17.5625ZM26.0002 22.5625C25.6912 22.5625 25.3891 22.4709 25.1321 22.2992C24.8752 22.1275 24.6749 21.8835 24.5566 21.5979C24.4384 21.3124 24.4074 20.9983 24.4677 20.6952C24.528 20.3921 24.6768 20.1137 24.8953 19.8951C25.1138 19.6766 25.3923 19.5278 25.6954 19.4675C25.9985 19.4072 26.3126 19.4382 26.5981 19.5564C26.8836 19.6747 27.1277 19.875 27.2994 20.1319C27.471 20.3889 27.5627 20.691 27.5627 21C27.5627 21.4144 27.3981 21.8118 27.105 22.1049C26.812 22.3979 26.4146 22.5625 26.0002 22.5625Z"/>
                    <rect x="0.5" y="0.5" width="51" height="41" rx="7.5"/>
                </svg>
            </a>
            <a href="/preview" class="button-url-direct">Preview</a>
        </div>
    </header>
    <aside class="box-section box-padding-full mobile-preview-container" data-section="mobile-preview"></aside>
    <main class="box-section box-padding-full links-profile-container" data-section="tabs">
        <!-- Javascript HTML rendered here from profile class.  Renders either renderLinksHTML() method or renderProfileDetailsHTML() method depending on what user clicks. -->
    </main>
</div>

<div id="app"></div>

<script>
    const userData = <?php echo get_user_data(); ?>; 
</script>
<script src="/frontend/scripts/profile.class.js"></script>
<script>
    const profile = new Profile(userData);
</script>
<?php
    Component::footer();
?>   
