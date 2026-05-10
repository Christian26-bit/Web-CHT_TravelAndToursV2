<?php
return [
    // Public Views (no auth required)
    'login' => ['file' => 'views/login.php', 'methods' => ['GET']],
    
    // Admin Views (require admin role)
    'admin/dashboard'     => ['file' => 'views/admin/dashboard.php',      'methods' => ['GET'], 'middleware' => ['auth', 'admin']],
    'admin/bookings'      => ['file' => 'views/admin/bookings.php',       'methods' => ['GET'], 'middleware' => ['auth', 'admin']],
    'admin/employees'     => ['file' => 'views/admin/employees.php',      'methods' => ['GET'], 'middleware' => ['auth', 'admin']],
    'admin/tour_packages' => ['file' => 'views/admin/tour_packages.php',  'methods' => ['GET'], 'middleware' => ['auth', 'admin']],
    'admin/clients'       => ['file' => 'views/admin/clients.php',        'methods' => ['GET'], 'middleware' => ['auth', 'admin']],

    // User Views (require auth)
    'user/dashboard'      => ['file' => 'views/user/userDashboard.php',       'methods' => ['GET'], 'middleware' => ['auth']],
    'user/bookings'       => ['file' => 'views/user/userBookings.php',        'methods' => ['GET'], 'middleware' => ['auth']],
    'user/clients'        => ['file' => 'views/user/userClients.php',         'methods' => ['GET'], 'middleware' => ['auth']],
    'user/hotel'          => ['file' => 'views/user/userHotel.php',           'methods' => ['GET'], 'middleware' => ['auth']],
    'user/payments'       => ['file' => 'views/user/userPayments.php',        'methods' => ['GET'], 'middleware' => ['auth']],
    'user/tour_packages'  => ['file' => 'views/user/userTourPackage.php',     'methods' => ['GET'], 'middleware' => ['auth']],
    'user/transportation' => ['file' => 'views/user/userTransportation.php',  'methods' => ['GET'], 'middleware' => ['auth']],
    'user/trips'          => ['file' => 'views/user/userTrips.php',           'methods' => ['GET'], 'middleware' => ['auth']],

    // Booking Wizard (require auth)
    'bookings/1' => ['file' => 'views/bookings/bookings1.php', 'methods' => ['GET'], 'middleware' => ['auth']],
    'bookings/2' => ['file' => 'views/bookings/bookings2.php', 'methods' => ['GET'], 'middleware' => ['auth']],
    'bookings/3' => ['file' => 'views/bookings/bookings3.php', 'methods' => ['GET'], 'middleware' => ['auth']],
    'bookings/4' => ['file' => 'views/bookings/bookings4.php', 'methods' => ['GET'], 'middleware' => ['auth']],
    'bookings/5' => ['file' => 'views/bookings/bookings5.php', 'methods' => ['GET'], 'middleware' => ['auth']],
    'bookings/6' => ['file' => 'views/bookings/bookings6.php', 'methods' => ['GET'], 'middleware' => ['auth']],

    // Public API (no auth)
    'api/login'  => ['file' => 'api/login.php',  'methods' => ['POST']],
    'api/logout' => ['file' => 'api/logout.php', 'methods' => ['POST', 'GET']],

    // Admin API (require admin)
    'api/admin/dashboard_summary' => ['file' => 'api/admin/dashboard_summary.php', 'methods' => ['GET'],          'middleware' => ['auth', 'admin']],
    'api/admin/employees_list'    => ['file' => 'api/admin/employees_list.php',    'methods' => ['GET'],          'middleware' => ['auth', 'admin']],
    'api/admin/list_employees'    => ['file' => 'api/admin/list_employees.php',    'methods' => ['GET'],          'middleware' => ['auth', 'admin']],
    'api/admin/list_packages'     => ['file' => 'api/admin/list_packages.php',     'methods' => ['GET'],          'middleware' => ['auth', 'admin']],
    'api/admin/save_employee'     => ['file' => 'api/admin/save_employee.php',     'methods' => ['POST'],         'middleware' => ['auth', 'admin']],
    'api/admin/employees_save'    => ['file' => 'api/admin/employees_save.php',    'methods' => ['POST'],         'middleware' => ['auth', 'admin']],
    'api/admin/save_package'      => ['file' => 'api/admin/save_package.php',      'methods' => ['POST'],         'middleware' => ['auth', 'admin']],
    'api/admin/delete_employee'   => ['file' => 'api/admin/delete_employee.php',   'methods' => ['POST','DELETE'],'middleware' => ['auth', 'admin']],
    'api/admin/delete_package'    => ['file' => 'api/admin/delete_package.php',    'methods' => ['POST','DELETE'],'middleware' => ['auth', 'admin']],
    'api/admin/employee_toggle'   => ['file' => 'api/admin/employee_toggle.php',   'methods' => ['POST'],         'middleware' => ['auth', 'admin']],

    // User API (require auth)
    'api/user_dashboard_summary' => ['file' => 'api/user/dashboard_summary.php', 'methods' => ['GET'],  'middleware' => ['auth']],
    'api/bookings_list'       => ['file' => 'api/user/bookings_list.php',       'methods' => ['GET'],  'middleware' => ['auth']],
    'api/bookings_save'       => ['file' => 'api/user/bookings_save.php',       'methods' => ['POST'], 'middleware' => ['auth']],
    'api/bookings_update'     => ['file' => 'api/user/bookings_update.php',     'methods' => ['POST'], 'middleware' => ['auth']],
    'api/bookings_delete'     => ['file' => 'api/user/bookings_delete.php',     'methods' => ['POST'], 'middleware' => ['auth']],
    'api/clients_list'        => ['file' => 'api/user/clients_list.php',        'methods' => ['GET'],  'middleware' => ['auth']],
    'api/clients_save'        => ['file' => 'api/user/clients_save.php',        'methods' => ['POST'], 'middleware' => ['auth']],
    'api/hotels_list'         => ['file' => 'api/user/hotels_list.php',         'methods' => ['GET'],  'middleware' => ['auth']],
    'api/packages_list'       => ['file' => 'api/user/packages_list.php',       'methods' => ['GET'],  'middleware' => ['auth']],
    'api/tour_packages_list'  => ['file' => 'api/user/tour_packages_list.php',  'methods' => ['GET'],  'middleware' => ['auth']],
    'api/payments_list'       => ['file' => 'api/user/payments_list.php',       'methods' => ['GET'],  'middleware' => ['auth']],
    'api/payments_save'       => ['file' => 'api/user/payments_save.php',       'methods' => ['POST'], 'middleware' => ['auth']],
    'api/transportation_list' => ['file' => 'api/user/transportation_list.php', 'methods' => ['GET'],  'middleware' => ['auth']],
    'api/trips_list'          => ['file' => 'api/user/trips_list.php',          'methods' => ['GET'],  'middleware' => ['auth']],
    'api/addons_list'         => ['file' => 'api/user/addons_list.php',         'methods' => ['GET'],  'middleware' => ['auth']],
    'api/calculate_cost'      => ['file' => 'api/user/calculate_cost.php',      'methods' => ['POST'], 'middleware' => ['auth']],
    'api/generate_pdf'        => ['file' => 'api/user/generate_pdf.php',        'methods' => ['GET'],  'middleware' => ['auth']],
];
?>