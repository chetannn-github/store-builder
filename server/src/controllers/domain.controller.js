import crypto from 'crypto';
import dns from 'dns/promises';
import Store from '../models/store.model.js';
import mongoose from 'mongoose';
import { updateCustomDomain } from '../services/k8sServices.js';

export const initiateDomainConnect = async (req, res) => {
    const { storeId, customDomain } = req.body;

    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid storeId",
      });
    }

    const store = await Store.findOne({
        _id: storeId,
        owner: req.user.userId,
    });
    
    if (!store) {
        return res.status(404).json({
        success: false,
        message: "Store not found",
        });
    }
    const token = crypto.randomBytes(16).toString('hex');
    
    await Store.findByIdAndUpdate(storeId, {
        customDomain: customDomain,
        domainValidationToken: token,
        domainStatus: 'PENDING_VALIDATION'
    }, { new: true });

    res.status(200).json({
        success: true,
        dnsRecords: [
            {
                type: "TXT",
                name: `_acme-challenge.${customDomain}`,
                value: `${token}.validation.instaconnector.in`
            },
            {
                type: "CNAME",
                name: `${customDomain.split('.')[0]}`,
                value: `${store.domain}`
            }
    ]
    });
};


export const verifyDomainDNS = async (req, res) => {
    const { storeId } = req.body;
     const store = await Store.findOne({
        _id: storeId,
        owner: req.user.userId,
    });
    
    if (!store) {
        return res.status(404).json({
        success: false,
        message: "Store not found",
        });
    }
    try {
        const challengeHost = `_acme-challenge.${store.customDomain}`;
        const records = await dns.resolveTxt(challengeHost);
        
        const expectedValue = `${store.domainValidationToken}.validation.instaconnector.in`;
        const isValid = records.flat().includes(expectedValue);

        console.log(records)

        if (isValid) {
            store.domainStatus = 'VALIDATED';
            await store.save();
            return res.json({ success: true, message: "DNS Validation Successful! Now add CNAME." });
        }
        
        return res.status(400).json({ success: false, message: "DNS record not found yet." });
    } catch (err) {
        return res.status(400).json({ success: false, message: "DNS lookup failed." });
    }
};



export const activateDomain = async (req, res) => {
    try {
        const { storeId } = req.body;
        const store = await Store.findOne({
            _id: storeId,
            owner: req.user.userId,
        });

        if (!store || store.domainStatus !== 'VALIDATED') {
            return res.status(400).json({ 
                success: false, 
                message: "Please verify your DNS records first." 
            });
        }
        (async () => {
            try {
                await updateCustomDomain(store);
                store.domainStatus = 'ACTIVE';
                await store.save();
                console.log(`Domain ${store.customDomain} is now ACTIVE`);
            } catch (err) {
                console.error(" Helm Upgrade Failed:", err);
                store.domainStatus = 'VALIDATION_FAILED';
                await store.save();
            }
        })();

        res.status(202).json({
            success: true,
            message: "Activation started. Your domain will be live with SSL in a few minutes."
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};