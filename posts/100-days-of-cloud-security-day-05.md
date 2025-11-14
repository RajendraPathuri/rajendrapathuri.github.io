---
title: '100 Days of Cloud Security - Day 5: Attack — `beanstalk_secrets`'
date: '2025-11-14'
author: 'Venkata Pathuri'
excerpt: 'Day 5 of my cloud security journey - Attack — `beanstalk_secrets`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 5: Attack — `beanstalk_secrets`

## Overview
Welcome to Day 5 of our cloud security journey! After exploring foundational concepts in previous days, we now step into the world of active defense and offense. Today, we will deploy the `beanstalk_secrets` scenario in CloudGoat and engage in a simulated attack to retrieve sensitive data from AWS Secrets Manager. This exercise not only enhances our understanding of cloud vulnerabilities but also equips us with the skills to identify and mitigate such risks in real-world environments.

## Learning Objectives
By the end of today’s session, you will gain hands-on experience in deploying a cloud vulnerability scenario, conducting privilege escalation, and accessing secured secrets within AWS. You’ll master the use of tools like Pacu for enumeration and exploit misconfigured IAM permissions to illustrate how attackers operate in a cloud environment. This knowledge will not only bolster your cloud security skills but also prepare you to defend against similar threats in your own cloud infrastructure.

## Deep Dive
### Understanding the Context: Elastic Beanstalk and Secrets Manager
Elastic Beanstalk is a powerful Platform as a Service (PaaS) that allows developers to deploy applications effortlessly. However, it is crucial to understand that storing sensitive information like access keys directly in environment variables is a significant security risk. Instead, AWS Secrets Manager provides a secure way to manage and retrieve secrets, ensuring that your applications can access necessary credentials without exposing them in code or configuration files.

### The Attack Scenario
In our lab, we will start by logging in as a low-privilege user. Initially, we will encounter restrictions when trying to view IAM policies—a common hurdle in real-world scenarios where attackers must first enumerate permissions to find ways to escalate their access. 

1. **Initial Enumeration**: Upon logging in as `cgidljwh25796a_low_priv_user`, we quickly discover limitations in our access, emphasizing the importance of IAM visibility in security audits.

2. **Using Pacu for Enumeration**: By leveraging Pacu, the AWS exploitation framework, we can execute modules designed to enumerate resources efficiently. The `elasticbeanstalk__enum` module reveals credentials for a secondary user, showcasing how attackers can pivot their access despite initial restrictions.

3. **Validating Secondary User**: Switching to the secondary user's credentials allows us to perform more actions, including creating new access keys. This step highlights a significant vulnerability: a low-privilege user can escalate their permissions through misconfigured IAM policies.

4. **Privilege Escalation**: Running the `iam__privesc_scan` module reveals that our secondary user can create new access keys for higher-privileged users. This is a critical moment in our attack, as we can now gain admin-level access by crafting a new access key for the Admin user.

5. **Accessing Secrets Manager**: With admin credentials in hand, we execute the `secrets__enum` module in Pacu. This allows us to enumerate available secrets and successfully retrieve the final flag, illustrating how misconfigured permissions can lead to unauthorized access to sensitive information.

### Best Practices
In the realm of cloud security, the lessons learned today can be applied to reinforce best practices:
- **Restrict IAM Permissions**: Regularly audit IAM policies to ensure that users have the least privileges necessary for their roles.
- **Use Secrets Manager**: Always store sensitive data in AWS Secrets Manager instead of hardcoding them in applications or environment variables.
- **Conduct Regular Security Assessments**: Perform vulnerability assessments and penetration testing to identify potential weaknesses in your cloud architecture.

## Hands-On Practice
To replicate today’s scenario, follow these steps:

1. **Set Up Your Environment**: Configure your AWS profile with the provided credentials and deploy the `beanstalk_secrets` scenario in CloudGoat.

2. **Perform Enumeration**:
   - Use Pacu to enumerate IAM resources as the low-privilege user.
   - Execute the `elasticbeanstalk__enum` module.

3. **Privilege Escalation**:
   - Validate the secondary user and run the `iam__privesc_scan` module.
   - Create a new access key for the Admin user.

4. **Access Secrets**:
   - With the new credentials, run `secrets__enum` in Pacu to retrieve the final flag.

Expected outcomes include successfully escalating privileges and accessing the secrets stored in AWS Secrets Manager. If you encounter issues, ensure your IAM permissions are correctly set and that you’re using the right modules in Pacu.

## Key Takeaways
Today, we delved into the intricacies of privilege escalation in AWS using the `beanstalk_secrets` attack scenario. The exercise highlighted how misconfigurations in IAM permissions can lead to significant security risks. By understanding the tools and techniques employed by attackers, we can better secure our cloud environments and prevent unauthorized access to sensitive information.

## Real-World Applications
In actual production environments, the insights gained from today’s attack scenario are invaluable. Organizations must prioritize securing IAM configurations and utilize tools like AWS Secrets Manager to manage sensitive credentials. Regular audits, employee training, and penetration testing can significantly mitigate the risks associated with misconfigured cloud resources.

---
**Journey Progress:** 5/100 Days Complete 🚀