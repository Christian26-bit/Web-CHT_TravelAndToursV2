<?php if (!isset($baseUrl)) $baseUrl = '/Web-CHT_TravelAndTours/'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <base href="<?php echo $baseUrl; ?>" >
    <script>const BASE_URL = "<?php echo $baseUrl; ?>";</script>
  <meta charset="UTF-8">
  <title>CHT Travel & Tour Management - Review & Confirm</title>
  <link rel="stylesheet" href="assets/css/customer-view.css">
  <link rel="stylesheet" href="assets/css/user_style.css">
  <link rel="stylesheet" href="assets/css/bookings.css">
</head>
<body class="cv-body">
  <!-- SIDEBAR -->
  <?php include dirname(__DIR__) . '/user/sidebar.php'; ?>

  <!-- MAIN CONTENT -->
  <main class="cv-content">
    <?php include dirname(__DIR__) . '/user/topbar.php'; ?>

    <div class="cv-main">
        <div class="cv-wizard-container">
            <!-- STEPS INDICATOR -->
            <section class="cv-wizard-steps">
                <div class="cv-step-item completed">
                    <div class="cv-step-circle">✓</div>
                    <span class="cv-step-label">Customer</span>
                </div>
                <div class="cv-step-line completed"></div>

                <div class="cv-step-item completed">
                    <div class="cv-step-circle">✓</div>
                    <span class="cv-step-label">Package</span>
                </div>
                <div class="cv-step-line completed"></div>

                <div class="cv-step-item completed">
                    <div class="cv-step-circle">✓</div>
                    <span class="cv-step-label">Add-ons</span>
                </div>
                <div class="cv-step-line completed"></div>

                <div class="cv-step-item completed">
                    <div class="cv-step-circle">✓</div>
                    <span class="cv-step-label">Hotel</span>
                </div>
                <div class="cv-step-line completed"></div>

                <div class="cv-step-item completed">
                    <div class="cv-step-circle">✓</div>
                    <span class="cv-step-label">Transport</span>
                </div>
                <div class="cv-step-line completed"></div>

                <div class="cv-step-item active">
                    <div class="cv-step-circle">6</div>
                    <span class="cv-step-label">Confirm</span>
                </div>
            </section>

            <!-- MAIN LAYOUT (Single Column for Review) -->
            <div style="max-width: 800px; margin: 0 auto; width: 100%;">
                <div class="cv-section-header" style="text-align: center;">
                    <h1 class="cv-page-title">Review & Confirm Booking</h1>
                    <p class="cv-page-subtitle">Please double-check all details before finalizing the booking.</p>
                </div>

                <div class="cv-card" style="padding: 32px; margin-bottom: 24px;">
                    <div class="cv-summary-list" id="reviewContent">
                        <!-- Review content populated by JS -->
                        <div style="text-align:center; padding:40px; color:var(--text-muted);">Loading summary...</div>
                    </div>

                    <div class="cv-summary-total-card" style="margin-top: 32px; background: var(--primary-light); border-radius: var(--radius-lg); padding: 24px;">
                        <div class="cv-total-label" style="color: var(--primary); font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Final Estimated Total</div>
                        <div class="cv-total-amount" id="finalTotal" style="color: var(--primary); font-size: 36px;">₱0</div>
                        <div class="cv-total-label" id="finalBreakdown">Inclusive of all selected services</div>
                    </div>

                    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-light);">
                        <label class="cv-form-label" style="display: flex; align-items: flex-start; gap: 12px; cursor: pointer;">
                            <input type="checkbox" id="termsCheckbox" style="width: 20px; height: 20px; margin-top: 2px;">
                            <span style="font-size: 14px; font-weight: 500; color: var(--text-body);">
                                I confirm that all information provided is accurate and the customer has agreed to the booking terms and conditions.
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- FOOTER -->
    <footer class="cv-wizard-footer">
        <button class="cv-btn cv-btn-outline" id="bookingBackBtn">
            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            Back
        </button>

        <div class="cv-wizard-progress-bar">
            <span class="cv-progress-text">Step 6 of 6</span>
            <div class="cv-progress-track">
                <div class="cv-progress-fill" style="width: 100%; background: var(--green);"></div>
            </div>
        </div>

        <button class="cv-btn cv-btn-primary" id="confirmBookingBtn" style="background: var(--green); border-color: var(--green);">
            <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:currentColor;margin-right:6px;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
            Finalize Booking
        </button>
    </footer>
  </main>

  <script src="assets/js/bookings/bookingState.js"></script>
  <script src="assets/js/bookings/bookings6.js"></script>
</body>
</html>
