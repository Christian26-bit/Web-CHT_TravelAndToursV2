<?php if (!isset($baseUrl)) $baseUrl = '/Web-CHT_TravelAndTours/'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <base href="<?php echo $baseUrl; ?>" >
    <script>const BASE_URL = "<?php echo $baseUrl; ?>";</script>
  <meta charset="UTF-8">
  <title>CHT Travel & Tour Management - New Booking (Step 1)</title>
  <link rel="stylesheet" href="assets/css/customer-view.css?v=1.1">
  <link rel="stylesheet" href="assets/css/user_style.css"><!-- base user layout -->
  <link rel="stylesheet" href="assets/css/bookings.css"><!-- booking wizard -->
</head>
<body class="cv-body">
  <!-- SIDEBAR (same as user dashboard) -->
  <?php include dirname(__DIR__) . '/user/sidebar.php'; ?>

  <!-- MAIN CONTENT -->
  <main class="cv-content">
    <?php include dirname(__DIR__) . '/user/topbar.php'; ?>

    <div class="cv-main">
        <div class="cv-wizard-container">
            <!-- STEP PROGRESS BAR -->
            <section class="cv-wizard-steps">
                <div class="cv-step-item active">
                    <div class="cv-step-circle">1</div>
                    <span class="cv-step-label">Customer</span>
                </div>
                <div class="cv-step-line"></div>

                <div class="cv-step-item">
                    <div class="cv-step-circle">2</div>
                    <span class="cv-step-label">Package</span>
                </div>
                <div class="cv-step-line"></div>

                <div class="cv-step-item">
                    <div class="cv-step-circle">3</div>
                    <span class="cv-step-label">Add-ons</span>
                </div>
                <div class="cv-step-line"></div>

                <div class="cv-step-item">
                    <div class="cv-step-circle">4</div>
                    <span class="cv-step-label">Hotel</span>
                </div>
                <div class="cv-step-line"></div>

                <div class="cv-step-item">
                    <div class="cv-step-circle">5</div>
                    <span class="cv-step-label">Transport</span>
                </div>
                <div class="cv-step-line"></div>

                <div class="cv-step-item">
                    <div class="cv-step-circle">6</div>
                    <span class="cv-step-label">Confirm</span>
                </div>
            </section>

            <!-- MAIN TWO-COLUMN AREA -->
            <div class="cv-wizard-grid">
                <!-- LEFT: FORM -->
                <div class="cv-wizard-form-area">
                    <div class="cv-section-header">
                        <h1 class="cv-page-title">Customer Information</h1>
                        <p class="cv-page-subtitle">Search for an existing customer or enter new customer details below.</p>
                    </div>

                    <!-- EXISTING CUSTOMER LOOKUP -->
                    <div class="cv-card" style="margin-bottom: 24px; padding: 20px;">
                        <label class="cv-form-label">Existing Customer Lookup</label>
                        <div class="cv-search-box" style="width: 100%; position: relative;">
                            <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                            <input type="text" id="existingCustomerSearch" placeholder="Search by Name, Email or ID..." style="padding-left: 44px;">
                        </div>
                    </div>

                    <!-- NEW CUSTOMER DETAILS -->
                    <div class="cv-card" style="padding: 24px;">
                        <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 20px; color: var(--text-dark);">Customer Details</h3>
                        <form id="bookingStep1Form" class="cv-form">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                <div class="cv-form-group">
                                    <label class="cv-form-label" for="custFullName">Full Customer Name</label>
                                    <input class="cv-form-input" id="custFullName" type="text" placeholder="Enter full name" required>
                                </div>
                                <div class="cv-form-group">
                                    <label class="cv-form-label" for="custContact">Contact Number</label>
                                    <input class="cv-form-input" id="custContact" type="text" placeholder="e.g. 0912...">
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                <div class="cv-form-group">
                                    <label class="cv-form-label" for="custEmail">Email Address</label>
                                    <input class="cv-form-input" id="custEmail" type="email" placeholder="email@example.com">
                                </div>
                                <div class="cv-form-group">
                                    <label class="cv-form-label" for="custDestination">Preferred Destination</label>
                                    <input class="cv-form-input" id="custDestination" type="text" placeholder="Enter destination">
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div class="cv-form-group">
                                    <label class="cv-form-label" for="custTravelType">Travel Type</label>
                                    <select class="cv-form-select" id="custTravelType">
                                        <option value="Leisure">Leisure</option>
                                        <option value="Business">Business</option>
                                        <option value="Family">Family</option>
                                        <option value="Solo">Solo</option>
                                    </select>
                                </div>
                                <div class="cv-form-group">
                                    <label class="cv-form-label" for="custPax">Number of Travellers (Pax)</label>
                                    <input class="cv-form-input" id="custPax" type="number" min="1" value="1">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- RIGHT: BOOKING SUMMARY SIDEBAR -->
                <aside class="cv-wizard-summary">
                    <div class="cv-summary-header">
                        <h3 class="cv-summary-title">Booking Summary</h3>
                        <div class="cv-summary-progress">
                            <span class="cv-summary-dot"></span>
                            <span id="summaryPercent">16% Complete</span>
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

    <!-- FOOTER NAV -->
    <footer class="cv-wizard-footer">
        <button class="cv-btn cv-btn-outline" id="bookingCancelBtn">
            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            Cancel
        </button>

        <div class="cv-wizard-progress-bar">
            <span class="cv-progress-text">Step 1 of 6</span>
            <div class="cv-progress-track">
                <div class="cv-progress-fill" style="width: 16%;"></div>
            </div>
        </div>

        <button class="cv-btn cv-btn-primary" id="bookingNextBtn">
            Next Step
            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
        </button>
    </footer>
  </main>

  <script src="assets/js/bookings/bookingState.js?v=1.1"></script>
  <script src="assets/js/bookings/bookings1.js?v=1.1"></script>
</body>
</html>
