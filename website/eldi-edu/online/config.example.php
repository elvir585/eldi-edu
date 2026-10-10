<?php
// Kopirajte kao eldi3333-config.php u direktorij IZNAD public_html.
// Nikada ne unosite lozinku baze u JavaScript ili HTML.
return [
 'dsn' => 'mysql:host=localhost;dbname=CPANEL_ELDI;charset=utf8mb4',
 'user' => 'CPANEL_KORISNIK',
 'password' => 'LOZINKA_BAZE',
 // Sami odaberite najmanje 24 nasumična znaka, sačuvajte ih za instalaciju.
 'install_token' => 'ZAMIJENITE_SVOJIM_DUGIM_NASUMICNIM_KLJUCEM',
];
