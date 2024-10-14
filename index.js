const https = require('https');

// Memeriksa apakah pengguna telah memasukkan username sebagai argumen
const username = process.argv[2];
const eventTypeFilter = process.argv[3]; // Argumen tambahan untuk filter jenis event (opsional)

if (!username) {
    console.error("Tolong masukkan username GitHub.");
    process.exit(1); // Keluar dengan status error
}

// Fungsi untuk mengambil data dari GitHub API
function fetchGitHubActivity(username) {
    const options = {
        hostname: 'api.github.com',
        path: `/users/${username}/events`,
        method: 'GET',
        headers: {
            'User-Agent': 'node.js'
        }
    };

    https.get(options, (res) => {
        let data = '';

        // Mengumpulkan data yang diterima
        res.on('data', (chunk) => {
            data += chunk;
        });

        // Ketika semua data telah diterima
        res.on('end', () => {
            if (res.statusCode === 200) {
                try {
                    // Parsing JSON
                    const events = JSON.parse(data);

                    // Memeriksa apakah respons API adalah array
                    if (Array.isArray(events)) {
                        if (events.length === 0) {
                            console.log(`${username} tidak memiliki aktivitas terbaru.`);
                        } else {
                            // Memfilter event jika tipe event diberikan
                            if (eventTypeFilter) {
                                const filteredEvents = events.filter(event => event.type === eventTypeFilter);
                                if (filteredEvents.length > 0) {
                                    displayActivity(filteredEvents);
                                } else {
                                    console.log(`Tidak ada aktivitas dengan tipe ${eventTypeFilter}`);
                                }
                            } else {
                                // Jika tidak ada filter, tampilkan semua event
                                displayActivity(events);
                            }
                        }
                    } else {
                        console.error("Respons API tidak valid atau tidak sesuai dengan format yang diharapkan.");
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error.message);
                }
            } else {
                console.error(`Terjadi kesalahan: ${res.statusCode}. Username mungkin tidak valid.`);
            }
        });
    }).on('error', (err) => {
        console.error(`Error: ${err.message}`);
    });
}

// Fungsi untuk menampilkan aktivitas pengguna dengan tanggal dan waktu
function displayActivity(events) {
    events.forEach((event) => {
        // Mengambil dan memformat waktu dari `created_at`
        const eventDate = new Date(event.created_at);
        const formattedDate = `${eventDate.toLocaleDateString()} ${eventDate.toLocaleTimeString()}`;

        switch (event.type) {
            case 'PushEvent':
                console.log(`[${formattedDate}] Pushed ${event.payload.commits.length} commit(s) ke repositori ${event.repo.name}`);
                break;
            case 'IssuesEvent':
                console.log(`[${formattedDate}] Membuka issue baru di ${event.repo.name}`);
                break;
            case 'WatchEvent':
                console.log(`[${formattedDate}] Memberi bintang ke ${event.repo.name}`);
                break;
            case 'ForkEvent':
                console.log(`[${formattedDate}] Forked repositori ${event.repo.name}`);
                break;
            default:
                console.log(`[${formattedDate}] Melakukan aktivitas ${event.type} di repositori ${event.repo.name}`);
                break;
        }
    });
}

// Memanggil fungsi untuk mengambil aktivitas GitHub
fetchGitHubActivity(username);
