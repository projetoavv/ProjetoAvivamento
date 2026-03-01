require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

function appendCSV(filename, obj) {
    const keys = Object.keys(obj);
    const line = keys.map(k => {
        const v = (obj[k]||'').toString().replace(/"/g, '""');
        return `"${v}"`;
    }).join(',');
    const exists = fs.existsSync(filename);
    if (!exists) {
        fs.writeFileSync(filename, keys.map(k=>`"${k}"`).join(',') + '\n');
    }
    fs.appendFileSync(filename, line + '\n');
}

async function sendEmail(subject, text) {
    if (!process.env.SMTP_HOST) return;
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'no-reply@jovenessarados.org',
        to: process.env.EMAIL_TO || process.env.SMTP_USER,
        subject,
        text
    });
}

app.post('/api/donate', async (req, res) => {
    try {
        const data = req.body;
        appendCSV(path.join(__dirname, 'donations.csv'), data);
        await sendEmail('Nova Doação', JSON.stringify(data, null, 2));
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false });
    }
});

app.post('/api/receive', async (req, res) => {
    try {
        const data = req.body;
        appendCSV(path.join(__dirname, 'requests.csv'), data);
        await sendEmail('Nova Solicitação de Doação', JSON.stringify(data, null, 2));
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false });
    }
});

app.post('/api/volunteer', async (req, res) => {
    try {
        const data = req.body;
        appendCSV(path.join(__dirname, 'volunteers.csv'), data);
        await sendEmail('Novo Voluntário', JSON.stringify(data, null, 2));
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false });
    }
});

app.post('/api/group', async (req, res) => {
    try {
        const data = req.body;
        appendCSV(path.join(__dirname, 'groups.csv'), data);
        await sendEmail('Novo Grupo Registrado', JSON.stringify(data, null, 2));
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false });
    }
});

app.post('/api/feedback', async (req, res) => {
    try {
        const data = req.body;
        appendCSV(path.join(__dirname, 'feedback.csv'), data);
        await sendEmail('Novo Feedback', JSON.stringify(data, null, 2));
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false });
    }
});

// Simple CSV parser for admin view
function parseLine(line) {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuotes) {
            if (ch === '"') {
                if (line[i + 1] === '"') { cur += '"'; i++; } else { inQuotes = false; }
            } else { cur += ch; }
        } else {
            if (ch === '"') { inQuotes = true; }
            else if (ch === ',') { result.push(cur); cur = ''; }
            else { cur += ch; }
        }
    }
    result.push(cur);
    return result;
}

function parseCSV(filePath) {
    if (!fs.existsSync(filePath)) return { headers: [], rows: [] };
    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) return { headers: [], rows: [] };
    const lines = raw.split(/\r?\n/);
    const headers = parseLine(lines[0]).map(h => h.replace(/^"|"$/g, ''));
    const rows = lines.slice(1).map(l => {
        const vals = parseLine(l);
        const obj = {};
        headers.forEach((h, i) => obj[h] = vals[i] ? vals[i].replace(/^"|"$/g, '') : '');
        return obj;
    });
    return { headers, rows };
}

function requireAdmin(req, res, next) {
    const auth = req.headers.authorization;
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;
    if (!adminUser || !adminPass) return res.status(403).send('Admin not configured');
    if (!auth || !auth.startsWith('Basic ')) {
        res.set('WWW-Authenticate', 'Basic realm="Admin"');
        return res.status(401).send('Authentication required');
    }
    const creds = Buffer.from(auth.split(' ')[1], 'base64').toString();
    const [u, p] = creds.split(':');
    if (u === adminUser && p === adminPass) return next();
    res.set('WWW-Authenticate', 'Basic realm="Admin"');
    return res.status(401).send('Invalid credentials');
}

function renderTable(data) {
    if (!data || !data.headers || data.headers.length === 0) return '<p>Sem dados</p>';
    let out = '<table><thead><tr>';
    data.headers.forEach(h => out += `<th>${h}</th>`);
    out += '</tr></thead><tbody>';
    data.rows.forEach(r => {
        out += '<tr>';
        data.headers.forEach(h => out += `<td>${(r[h]||'').replace(/</g,'&lt;')}</td>`);
        out += '</tr>';
    });
    out += '</tbody></table>';
    return out;
}

app.get('/admin', requireAdmin, (req, res) => {
    const donations = parseCSV(path.join(__dirname, 'donations.csv'));
    const requests = parseCSV(path.join(__dirname, 'requests.csv'));
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Admin — Jovens Sarados</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>body{font-family:Inter,Arial,Helvetica,sans-serif;padding:18px;background:#f7fbff;color:#06223a}h1{margin-top:0}table{border-collapse:collapse;width:100%;margin-bottom:28px}th,td{border:1px solid #e6eef9;padding:8px;text-align:left}th{background:#f0f6ff}</style></head><body>
    <h1>Painel administrativo</h1>
    <section><h2>Doações</h2>${renderTable(donations)}</section>
    <section><h2>Solicitações</h2>${renderTable(requests)}</section>
    </body></html>`;
    res.send(html);
});


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});


