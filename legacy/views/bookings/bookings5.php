<?php if (!isset($baseUrl)) $baseUrl = '/Web-CHT_TravelAndTours/'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <base href="<?php echo $baseUrl; ?>" >
    <script>const BASE_URL = "<?php echo $baseUrl; ?>";</script>
  <meta charset="UTF-8">
  <title>CHT Travel & Tour Management - New Booking (Step 5)</title>
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

                <div class="cv-step-item active">
                    <div class="cv-step-circle">5</div>
                    <span class="cv-step-label">Transport</span>
                </div>
                <div class="cv-step-line"></div>

                <div class="cv-step-item">
                    <div class="cv-step-circle">6</div>
                    <span class="cv-step-label">Confirm</span>
                </div>
            </section>

            <!-- MAIN LAYOUT -->
            <div class="cv-wizard-grid">
                <!-- LEFT: TRANSPORT LIST -->
                <div class="cv-wizard-form-area">
                    <div class="cv-section-header">
                        <h1 class="cv-page-title">Select Transportation</h1>
                        <p class="cv-page-subtitle">Choose a vehicle for your customer’s group size and comfort.</p>
                    </div>

                    <div class="cv-card" style="padding: 24px;">
                        <div id="transportList" class="cv-summary-list">
                            <!-- rows rendered by JS -->
                            <div style="text-align:center; padding:40px; color:var(--text-muted);">Loading transportation...</div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT: SUMMARY -->
                <aside class="cv-wizard-summary">
                    <div class="cv-summary-header">
                        <h3 class="cv-summary-title">Booking Summary</h3>
                        <div class="cv-summary-progress">
                            <span class="cv-summary-dot"></span>
                            <span id="summaryPercent">83% Complete</span>
                        </div>
                    </div>

                    <div class="cv-summary-list">
                        <div class="cv-summary-item">
                            <div class="cv-summary-icon">👤</div>
                            <div class="cv-summary-content">
                                <span class="cv-summary-label">Customer</span>
                                <div class="cv-summary-value" id="summaryCustomer">Not set</div>
                            </div>
                        </div>

                        <div class="cv-summary-item">
                            <div class="cv-summary-icon">🧳</div>
                            <div class="cv-summary-content">
                                <span class="cv-summary-label">Package</span>
                                <div class="cv-summary-value" id="summaryPackage">Not selected</div>
                            </div>
                        </div>

                        <div class="cv-summary-item">
                            <div class="cv-summary-icon">🏨</div>
                            <div class="cv-summary-content">
                                <span class="cv-summary-label">Hotel</span>
                                <div class="cv-summary-value" id="summaryHotel">Not selected</div>
                            </div>
                        </div>

                        <div class="cv-summary-item">
                            <div class="cv-summary-icon">🚐</div>
                            <div class="cv-summary-content">
                                <span class="cv-summary-label">Transport</span>
                                <div class="cv-summary-value" id="summaryTransport">Not selected</div>
                            </div>
                        </div>
                    </div>

                    <div class="cv-summary-total-card">
                        <div class="cv-total-amount" id="summaryTotal">₱0</div>
                        <div class="cv-total-label" id="summaryBreakdown">Add items to see total</div>
                    </div>
                </aside>
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
            <span class="cv-progress-text">Step 5 of 6</span>
            <div class="cv-progress-track">
                <div class="cv-progress-fill" style="width: 83%;"></div>
            </div>
        </div>

        <button class="cv-btn cv-btn-primary" id="bookingNextBtn">
            Next Step
            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
        </button>
    </footer>
  </main>

  <script src="assets/js/bookings/bookingState.js"></script>
  <script src="assets/js/bookings/bookings5.js"></script>
</body>
</html>
