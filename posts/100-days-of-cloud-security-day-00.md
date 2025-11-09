---
title: '100 Days of Cloud Security - Day 0: Lab Setup'
date: '2025-11-09'
author: 'Rajendra Pathuri'
excerpt: 'Day 0 of my cloud security journey - Lab Setup'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 0: Lab Setup

## Overview
Welcome to the start of an exhilarating 100-day adventure into the world of cloud security! Today marks Day 0 of our journey, where we lay the foundational groundwork for what lies ahead. Building a robust lab environment is crucial; it’s where theory meets practice, and the skills we develop will be critical as we venture deeper into cloud security concepts.

## Learning Objectives
By the end of today, you will have successfully set up a lab environment tailored for cloud security tasks. You'll master the installation and configuration of essential tools like Claude Code, CloudGoat, Prowler, ScoutSuite, and CloudMapper. This knowledge will empower you to assess cloud environments for vulnerabilities and misconfigurations, setting the stage for more advanced topics in upcoming days.

## Deep Dive
### Setting Up Your Lab
The first step in our cloud security journey is establishing a functional lab. The idea here is to create an environment where you can experiment, learn, and practice securely.

1. **Installing Claude Code**: This terminal-based tool will become invaluable as we progress, allowing us to easily execute scripts and commands. Once installed, you'll see a sleek interface that enhances your productivity.

2. **Configuring CloudGoat**: Using the provided script at `scripts/cloudgoat-install.sh`, we installed CloudGoat, which is a penetration testing tool designed specifically for AWS environments. It simulates real-world scenarios that cloud security professionals face, allowing you to practice your skills in a controlled setting.

3. **What About Other Tools?**: Alongside CloudGoat, we installed Prowler, ScoutSuite, and CloudMapper. Each of these tools plays a unique role:
   - **Prowler**: This tool scans your cloud environment for vulnerabilities and compliance issues, providing a comprehensive assessment of your security posture. Imagine running a scan and seeing a detailed report highlighting potential misconfigurations—this is where Prowler shines.
   - **ScoutSuite**: Think of ScoutSuite as your cloud security auditor. It gathers configuration data and identifies risks, ensuring you remain compliant with industry standards.
   - **CloudMapper**: This tool allows you to visualize your AWS resources and their interconnections, making it easier to understand your cloud architecture. Picture a digital map of your cloud resources, highlighting areas that need attention.

### Best Practices
- **Documentation**: Keep a detailed record of your lab setup process. This not only helps you understand what you did but also serves as a reference for troubleshooting later.
- **Resource Monitoring**: Be mindful of your cloud usage. Tools like AWS Budgets can help you track spending and avoid unexpected charges.

## Hands-On Practice
Now that your lab is set up, let’s verify everything is working as intended:

1. **Verify Claude Code Installation**:
   Open your terminal and type:
   ```bash
   claude --version
   ```
   You should see the version number of Claude Code. If not, check your installation steps.

2. **Run CloudGoat**:
   Execute the following command to ensure CloudGoat is properly installed:
   ```bash
   cloudgoat help
   ```
   You should see a list of commands and options available with CloudGoat.

3. **Check Prowler**:
   To verify Prowler, run:
   ```bash
   ./prowler -h
   ```
   A help menu will appear, confirming your installation was successful.

### Troubleshooting Tips
- If you encounter issues with installations, revisit the installation scripts for errors.
- Make sure you have the necessary permissions in your cloud environment to run these tools.

## Key Takeaways
Today’s setup was not just about installing software; it was about creating a secure, interactive environment where we’ll explore cloud security landscapes. As we move forward, these tools will be our eyes and ears, helping us identify and mitigate risks in cloud infrastructures.

## Real-World Applications
In production environments, having a tailored lab for security assessments is invaluable. Organizations often use similar tools to conduct regular audits and ensure compliance with security policies. For example, a company may run Prowler weekly to catch any misconfigurations before they lead to security incidents.

## What's Next?
As we wrap up Day 0, get excited for Day 1, where we’ll dive into our first real-world scenarios using CloudGoat. We’ll start testing our skills and gaining hands-on experience in identifying vulnerabilities. This is just the beginning; the adventure is only getting started!

---
**Journey Progress:** 0/100 Days Complete 🚀