---
title: '100 Days of Cloud Security - Day 20: Defend - `federated_console_takeover`'
date: '2025-11-29'
author: 'Venkata Pathuri'
excerpt: 'Day 20 of my cloud security journey - Defend - `federated_console_takeover`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 20: Defend - `federated_console_takeover`

## Overview
Welcome to Day 20 of our cloud security journey! Today, we delve into the critical topic of defending against the `federated_console_takeover` scenario, building on the foundational elements we've established in our previous discussions. As we progress, securing the AWS environment becomes increasingly vital, especially in the context of federated access, which poses unique risks to our resources.

## Learning Objectives
By the end of today's session, you will master essential strategies for limiting privileged access through federated console takeover threats. You will learn to configure permissions for AWS Systems Manager (SSM) sessions, strengthen EC2 instance metadata service settings, and implement measures to prevent privilege escalation. This knowledge will empower you to design a robust defense against unauthorized access, enhancing your cloud security posture.

## Deep Dive

### Understanding the Threat Landscape
The `federated_console_takeover` scenario is a significant concern in cloud environments, where users may exploit privileged access to gain unauthorized control over resources. One of the primary methods attackers use is through SSM sessions, which can inadvertently expose EC2 instances to unauthorized actions if not properly secured.

### Restricting SSM Session Access
To mitigate risks, it is essential to limit the `ssm:StartSession` permission. Instead of allowing all users unrestricted access to EC2 instances, we can enforce conditional policies. For example, by tagging instances with specific identifiers and granting access based on those tags, we can significantly reduce the attack surface.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeIamInstanceProfileAssociations",
                "iam:ListRoles",
                "sts:GetCallerIdentity"
            ],
            "Effect": "Allow",
            "Resource": "*"
        },
        {
            "Action": [
                "ssm:StartSession"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:ec2:us-east-1:997581282912:instance/i-0fc11732d00710280",
            "Condition": { 
                "StringEquals": { 
                    "aws:ResourceTag/Environment": "authorized-access" 
                }
            }
        },
        {
            "Action": [
                "ssm:TerminateSession"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:ssm:*:*:session/${aws:username}-*"
        }
    ]
}
```

This policy example demonstrates how to leverage AWS tags to ensure that only authorized users can initiate SSM sessions on specific instances.

### Hardening EC2 Instance Metadata Service
The EC2 instance metadata service (IMDS) is a crucial component that provides instance-specific information. However, if improperly configured, it can become a vector for attacks. By limiting the metadata hop limit to 1, we ensure that only the instance itself can access its metadata, effectively blocking any Server-Side Request Forgery (SSRF) attempts.

### Preventing Privilege Escalation
Privilege escalation is another concern when users gain access to SSM sessions. To prevent users from escalating their privileges from `ssm-user` to `root`, we can modify the SSM session environment. This involves disabling `sudo` access and informing users that their session is monitored.

```bash
cd /home/ssm-user
export PS1='[SSM-SESSION] \\u@\\h:\\w\\$ '
echo 'Session is logged and monitored'
alias sudo='echo "Root access disabled in SSM sessions"'
```

This approach not only restricts access but serves as a reminder to users that their actions are being tracked.

### Blocking Federation Token Generation
Finally, to close the loop on unauthorized console access, it’s vital to prevent users from generating federation tokens. By adding an explicit deny statement for `sts:GetFederationToken` in the role's trust policy, we can effectively block unauthorized federation attempts.

```json
{
    "Effect": "Deny",
    "Action": [
        "sts:GetFederationToken"
    ],
    "Resource": "*"
}
```

## Hands-On Practice
To solidify your understanding, here are the steps for implementing these security measures:

1. **Configure SSM Session Policies:**
   - Use the AWS Management Console or CLI to update IAM policies, ensuring that only tagged instances can be accessed via SSM.

2. **Modify Metadata Service Configuration:**
   - Implement IMDSv2 and set the hop limit to 1 to restrict access.

3. **Adjust SSM Session Environment:**
   - Update the SSM session configuration to disable `sudo` and add monitoring messages.

4. **Update Role Trust Policy:**
   - Modify the relevant IAM role to include the deny statement for federation tokens.

### Verification
After implementing these changes, verify the restrictions by attempting to start an SSM session on an untagged instance or escalate privileges within an SSM session. You should see access denied messages.

## Key Takeaways
Today, we explored critical strategies for defending against the `federated_console_takeover` scenario. By implementing targeted permissions, hardening metadata access, and preventing privilege escalation, we can significantly enhance the security of our AWS environments. These practices not only protect against potential threats but also build a more resilient security framework.

## Real-World Applications
In production environments, these concepts are vital for organizations utilizing AWS. By employing these strategies, businesses can safeguard their resources against unauthorized access, ensuring compliance with security standards and protecting sensitive data. Regularly reviewing and adjusting IAM policies, as demonstrated today, is a best practice that should become part of your security routine.

---
**Journey Progress:** 20/100 Days Complete 🚀