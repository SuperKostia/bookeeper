# @bookeeper/mobile

Expo 52 + expo-router. iOS + Android.

## Dev

```bash
pnpm -F @bookeeper/mobile dev
# puis presse i (iOS), a (Android), w (web preview)
```

Structure expo-router :

```
app/
├── _layout.tsx     # stack root
└── index.tsx       # home screen
```

Prochains écrans à ajouter :
- `(auth)/signup.tsx` — phone + OTP
- `(tabs)/search.tsx` — recherche keeper
- `keeper/[id].tsx` — profil
- `booking/[id].tsx` — détail réservation
