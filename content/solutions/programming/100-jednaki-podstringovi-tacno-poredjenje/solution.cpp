#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    cin >> s;
    int n = s.size(), q;
    cin >> q;
    vector < vector < int >> redovi(1, vector < int > (n));
    for (int i = 0; i < n; i++) redovi [0] [i] = (unsigned char) s [i];
    for (int duzina = 1; 2 * duzina <= n; duzina *= 2) {
        const auto & prethodni = redovi.back();
        int koliko = n - 2 * duzina + 1;
        vector < tuple < int, int, int >> parovi;
        for (int i = 0; i < koliko; i++) parovi.push_back({
            prethodni [i], prethodni [i + duzina], i
        }
        );
        sort(parovi.begin(), parovi.end());
        vector < int > novi(koliko);
        int oznaka = - 1;
        pair < int, int > zadnji = {
            - 1, - 1
        }
        ;
        for (auto [lijevi, desni, i] : parovi) {
            pair < int, int > kljuc = {
                lijevi, desni
            }
            ;
            if (kljuc != zadnji) {
                oznaka++;
                zadnji = kljuc;
            }
            novi [i] = oznaka;
        }
        redovi.push_back(move(novi));
    }
    vector < int > lg(n + 1);
    for (int i = 2; i <= n; i++) lg [i] = lg [i / 2] + 1;
    while (q--) {
        int l1, r1, l2, r2;
        cin >> l1 >> r1 >> l2 >> r2;
        -- l1;
        -- r1;
        -- l2;
        -- r2;
        int nivo = lg [r1 - l1 + 1], p = 1 << nivo;
        const auto & a = redovi [nivo];
        bool isti = a [l1] == a [l2] && a [r1 - p + 1] == a [r2 - p + 1];
        cout << (isti ? "DA" : "NE") << '\n';
    }
}
