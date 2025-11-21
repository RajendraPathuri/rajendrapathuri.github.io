---
title: '100 Days of Cloud Security - Day 12: Defend - `vulnerable_cognito`'
date: '2025-11-21'
author: 'Venkata Pathuri'
excerpt: 'Day 12 of my cloud security journey - Defend - `vulnerable_cognito`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 12: Defend - `vulnerable_cognito`

## Overview
Welcome back to our cloud security journey! As we dive into Day 12, we build upon the foundational security principles we've developed in the previous sessions. Today, we will tackle the `vulnerable_cognito` scenario, which highlights the critical importance of securing AWS Cognito user pools and identity pools. By understanding and remediating these vulnerabilities, you will strengthen your skills in cloud security and prepare yourself for real-world challenges.

## Learning Objectives
In today’s session, our primary goal is to master the secure implementation of AWS Cognito by identifying and remediating vulnerabilities. You will learn how to remove sensitive information from your source code, adjust permissions to prevent privilege escalation, and implement best practices for protecting your applications. By the end of this day, you will have the practical skills to secure user authentication mechanisms effectively, which is pivotal for maintaining user trust and data integrity.

## Deep Dive
### Understanding Cognito Vulnerabilities
AWS Cognito is a powerful service for managing user authentication, but it can be a double-edged sword if not configured correctly. In the `vulnerable_cognito` scenario, we identified several critical security flaws that could be exploited by malicious actors. 

1. **Exposing Sensitive Information**: The source code revealed user pool and identity pool IDs. When exposed, these identifiers can facilitate enumeration attacks, making it easy for attackers to access user information.

2. **Excessive Permissions**: The lambda function was initially allowing users to change their access level, which could lead to unauthorized privilege escalation. This oversight could enable a regular user to gain admin privileges simply by modifying their custom attributes.

3. **Overly Permissive IAM Roles**: The IAM roles configured for the application were too broad. This lack of specificity permitted access to resources that should be restricted, increasing the risk of cross-account access and data breaches.

### Remediation Steps
To secure our Cognito implementation, we took the following steps:

1. **Removing Sensitive Attributes**: By eliminating the exposure of user pool ID and identity pool ID from the source code, we reduce the attack surface. This practice is essential in safeguarding against enumeration attempts.

2. **Restricting Lambda Function Permissions**: We modified the lambda function code to ensure that the `custom:access` attribute is always set to 'reader'. This change ensures that even if a user attempts to escalate their privileges by sending an admin access request, it will be blocked.

    ```python
    import json
    import boto3

    client = boto3.client('cognito-idp')

    def lambda_handler(event, context):
        user_pool_id = event['userPoolId']
        username = event['request']['userAttributes']['sub']
        
        print(f"Setting custom:access = reader for user: {username}")
        
        # Always set to 'reader' only, ignore any other value
        client.admin_update_user_attributes(
            UserPoolId=user_pool_id,
            Username=username,
            UserAttributes=[{'Name': 'custom:access', 'Value': 'reader'}]
        )
        
        return event
    ```

3. **Restricting IAM Roles**: We updated the IAM role policies to specify the minimum required permissions for each resource. For example, we restricted S3 access to only the necessary buckets and ensured that actions on Cognito and Lambda were limited to specific resources.

    ```bash
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "s3:GetObject",
                    "s3:ListBucket"
                ],
                "Resource": [
                    "arn:aws:s3:::cognitoctf-cgidvkbgu34h4l",
                    "arn:aws:s3:::cognitoctf-cgidvkbgu34h4l/*"
                ]
            },
            {
                "Effect": "Allow",
                "Action": [
                    "cognito-idp:GetUser"
                ],
                "Resource": [
                    "arn:aws:cognito-idp:us-east-1:997581282912:userpool/us-east-1_vWfb2fStY"
                ]
            },
            {
                "Effect": "Allow",
                "Action": [
                    "cognito-identity:GetCredentialsForIdentity",
                    "cognito-identity:GetOpenIdToken"
                ],
                "Resource": [
                    "arn:aws:cognito-identity:us-east-1:997581282912:identitypool/us-east-1:c46660d8-8b20-4b4e-8aca-c25b7643035c"
                ]
            },
            {
                "Effect": "Allow",
                "Action": [
                    "lambda:InvokeFunction"
                ],
                "Resource": [
                    "arn:aws:lambda:us-east-1:997581282912:function:CognitoCTF-cgidvkbgu34h4l"
                ]
            }
        ]
    }
    ```

4. **Enabling CloudTrail and CloudWatch**: We implemented CloudTrail to monitor and log API calls made in the account. Integrating it with CloudWatch allows us to set up alerts for any suspicious activities, further enhancing our security posture.

## Hands-On Practice
To implement these changes, follow these steps in your AWS environment:

1. **Update Your Source Code**:
   - Remove any hardcoded identifiers from your application code.
   - Ensure sensitive information is not logged or displayed.

2. **Modify the Lambda Function**:
   - Update the lambda function code as shown above to enforce fixed user roles.

3. **Adjust IAM Policies**:
   - Modify your IAM role policies according to the provided JSON example, ensuring that permissions are scoped to the least privilege required.

4. **Enable CloudTrail**:
   - Navigate to the CloudTrail console and enable logging for your account.
   - Integrate CloudTrail with CloudWatch for monitoring.

Verify that the changes are effective by testing user sign-ups and ensuring that unauthorized access is blocked. Monitor CloudTrail logs for any unexpected calls or activities.

## Key Takeaways
Today, we learned the significance of securing AWS Cognito and the necessary steps to remediate vulnerabilities. By removing sensitive information, restricting permissions, and enhancing monitoring, we bolster our security posture and protect user data. Remember, preventing privilege escalation and applying the principle of least privilege are essential practices in any secure cloud environment.

## Real-World Applications
These concepts are vital for organizations that rely on AWS for user authentication and data management. In real-world applications, adhering to these security best practices not only protects your data but also builds user trust. Industries like finance, healthcare, and e-commerce, where user data is sensitive, must implement these security measures to mitigate risks associated with identity theft and unauthorized access.

---
**Journey Progress:** 12/100 Days Complete 🚀