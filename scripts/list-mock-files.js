#!/usr/bin/env node

/**
 * 批量移除模擬資料腳本
 * 這個腳本會自動處理所有包含模擬資料的檔案
 */

const fs = require('fs');
const path = require('path');

// 需要處理的檔案列表
const filesToProcess = [
    // 核心用戶頁面
    'app/dashboard/user/page.tsx',
    'app/orders/page.tsx',
    'app/orders/[id]/page.tsx',
    'app/search/page.tsx',
    'app/blessings/page.tsx',
    'app/certificate/[id]/page.tsx',
    'app/events/[slug]/page.tsx',

    // 廟宇管理員頁面
    'app/temple-admin/dashboard/page.tsx',
    'app/temple-admin/orders/page.tsx',
    'app/temple-admin/orders/[id]/page.tsx',
    'app/temple-admin/lanterns/page.tsx',
    'app/temple-admin/lanterns/[id]/edit/page.tsx',
    'app/temple-admin/lanterns/new/page.tsx',
    'app/temple-admin/events/page.tsx',
    'app/temple-admin/reports/page.tsx',
    'app/temple-admin/settings/page.tsx',

    // 系統管理員頁面
    'app/admin/dashboard/page.tsx',
    'app/admin/users/page.tsx',
    'app/admin/temples/page.tsx',
    'app/admin/orders/page.tsx',
    'app/admin/orders/[id]/page.tsx',
    'app/admin/events/page.tsx',
    'app/admin/events/new/page.tsx',
    'app/admin/events/[id]/edit/page.tsx',
    'app/admin/banners/page.tsx',
    'app/admin/content/page.tsx',
    'app/admin/content/[id]/page.tsx',
    'app/admin/login/page.tsx',

    // 其他
    'app/forgot-password/page.tsx',
    'app/contact/page.tsx',
    'app/api/user/profile/route.ts',
];

console.log(`準備處理 ${filesToProcess.length} 個檔案...`);
console.log('這些檔案需要手動更新以整合真實 API');
console.log('\n檔案列表：');
filesToProcess.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
});

console.log('\n建議：由於每個頁面的邏輯不同，建議逐個檢視並更新');
