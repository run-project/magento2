<?php
/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\BraintreeTwo\Gateway\Validator;

use Braintree\Result\Error;
use Braintree\Result\Successful;
use Braintree\Transaction;
use Magento\Payment\Gateway\Validator\ResultInterfaceFactory;

/**
 * Class ResponseValidator
 */
class ResponseValidator extends GeneralResponseValidator
{
    /**
     * @return array
     */
    protected function getResponseValidators()
    {
        return array_merge(
            parent::getResponseValidators(),
            [
                function ($response) {
                    return [
                        isset($response->transaction)
                        && in_array(
                            $response->transaction->status,
                            [Transaction::AUTHORIZED, Transaction::SUBMITTED_FOR_SETTLEMENT, Transaction::SETTLING]
                        ),
                        [__('Wrong transaction status')]
                    ];
                }
            ]
        );
    }
}
